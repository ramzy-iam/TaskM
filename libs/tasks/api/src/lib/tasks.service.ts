import { BadRequestException, Injectable } from '@nestjs/common';
import { CompetencesService } from '@TaskM/competences/api';
import { TaskDateFilterField, TaskTypeCode } from '@TaskM/core/constants';
import { Task, TasksRepository } from '@TaskM/core/db';
import { TasksFilterDto, CreateTaskDto, UpdateTaskDto } from '@TaskM/core/dto';
import { DayjsHelper, UtilsHelper } from '@TaskM/core/helpers';
import { paginateResult } from '@TaskM/core/helpers/backend';
import { ProjectsService } from '@TaskM/projects/api';
import { capitalize } from 'radash';

@Injectable()
export class TasksService {
  constructor(
    private tasksRepository: TasksRepository,
    private projectsService: ProjectsService,
    private competencesService: CompetencesService,
  ) {}

  async create(taskDto: CreateTaskDto) {
    await this.validateBeforeCreateOrUpdate(taskDto);

    const { code, lang } = await this.generateSpecialFields(taskDto.projectId);

    let task = this.tasksRepository.create({
      ...taskDto,
      assignedAt: DayjsHelper.new(taskDto.assignedAt).toDate(),
      code,
      lang,
    });

    task = await this.tasksRepository.save(task);
    return this.getOne(task.id);
  }

  getOne(id: string) {
    return this.tasksRepository.scoped
      .filterById(id)
      .joinProject()
      .joinLinguist()
      .joinRate()
      .getOneOrFail();
  }

  async update(id: string, taskDto: UpdateTaskDto) {
    await this.validateBeforeCreateOrUpdate(taskDto, id);

    await this.tasksRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(taskDto),
    );
    return this.getOne(id);
  }

  private async validateBeforeCreateOrUpdate(
    taskDto: Partial<CreateTaskDto>,
    taskId?: string,
  ) {
    const existingTask = taskId
      ? await this.tasksRepository.scoped.filterById(taskId).getOne()
      : null;

    const project = (await this.projectsService.findOne({
      id: taskDto?.projectId ?? existingTask?.projectId,
    }))!;

    if (taskDto?.rateId) {
      const rate = await this.competencesService.findOne({
        id: taskDto.rateId,
        linguistId: taskDto?.linguistId ?? existingTask?.linguistId,
      });

      if (!rate) throw new BadRequestException(`Rate not found`);
      if (
        existingTask &&
        (taskDto?.linguistId ?? existingTask?.linguistId) !== rate.linguistId
      ) {
        throw new BadRequestException(
          `Rate is not associated with the linguist`,
        );
      }
    }

    const { receivedAt, internalDeadline } = project;
    if (
      taskDto?.deadline &&
      !DayjsHelper.isBeforeOrSame(taskDto.deadline, internalDeadline)
    )
      throw new BadRequestException(
        `Deadline must be before the project internal deadline`,
      );

    if (
      taskDto?.assignedAt &&
      !DayjsHelper.isBeforeOrSame(taskDto.assignedAt, internalDeadline) &&
      !DayjsHelper.isAfterOrSame(receivedAt, taskDto.assignedAt)
    )
      throw new BadRequestException(
        `Assigned at must be between the project received at and internal deadline`,
      );

    //check unit
    const { unit: projectUnit, count: projectLoad } = project;
    const taskUnit = taskDto?.unit ?? existingTask?.unit;
    if (taskUnit !== projectUnit)
      throw new BadRequestException(
        `Task unit must be the same as the project unit (${capitalize(projectUnit)})`,
      );

    if (typeof taskDto.count === 'number') {
      const taskType = (taskDto?.type ?? existingTask?.type)!;
      const excludedTaskIds: string[] = [];
      if (existingTask) excludedTaskIds.push(existingTask.id);

      const remainingLoadForTaskType = await this.getRemainingLoad(
        project.id,
        taskType,
        excludedTaskIds,
      );

      if (taskDto.count > remainingLoadForTaskType)
        throw new BadRequestException(
          `Task count must be less or equal than the remaining load (${remainingLoadForTaskType} ${capitalize(taskUnit)}) for the task type`,
        );
    }
  }

  findAll<P = Task[]>(filters?: TasksFilterDto) {
    const query = this.buildQuery(filters)
      .joinProject()
      .joinClient()
      .joinLinguist()
      .joinRate()
      ._orderBy(filters?.orderField, filters?.order);

    return (
      filters?.page && filters?.limit
        ? paginateResult(query, { page: filters?.page, limit: filters.limit })
        : query.getMany()
    ) as Promise<P>;
  }

  private async generateSpecialFields(projectId: string) {
    const today = DayjsHelper.new();
    const from = today.startOf('M').toDate();
    const to = today.endOf('M').toDate();
    const monthTaskCount = await this.tasksRepository.scoped
      .filterByDate(from, to, TaskDateFilterField.CREATED_AT)
      .withDeleted()
      .getCount();

    const todayFormatted = today.format('YYMMDD');

    const newNumber = (monthTaskCount + 1).toString().padStart(3, '0');
    const code = `${todayFormatted}${newNumber}`;

    const project = await this.projectsService.getOne(projectId);

    return { code, lang: project.lang };
  }

  findOne(filters?: TasksFilterDto) {
    return this.buildQuery(filters)
      .joinProject()
      .joinLinguist()
      .joinRate()
      .getOne();
  }

  private buildQuery(filters?: TasksFilterDto) {
    const query = this.tasksRepository.scoped;

    if (filters?.id) query.filterById(filters.id);
    if (filters?.code) query.filterByCode(filters.code);
    if (filters?.linguistId) query.filterByLinguistId(filters.linguistId);
    if (filters?.projectId) query.filterByProjectId(filters.projectId);
    if (filters?.projectCode) query.filterByProjectCode(filters.projectCode);
    if (filters?.task) query.filterByType(filters?.task);
    if (filters?.status) query.filterByStatus(filters?.status);
    if (filters?.query) query.filterByQuery(filters?.query);

    query.filterByDate(filters?.from, filters?.to, filters?.dateField);

    return query;
  }

  async getRemainingLoad(
    projectId: string,
    taskType: TaskTypeCode,
    excludedTaskIds: string[] = [],
  ): Promise<number> {
    const project = await this.projectsService.getOne(projectId);
    const totalLoadForTaskType = (await this.tasksRepository.scoped
      .filterByType(taskType)
      .filterByProjectId(project.id)
      .filterByExcludingTaskIds(excludedTaskIds)
      .joinProject()
      .select('COALESCE(SUM("Tasks"."count"), 0)', 'total')
      .getRawOne<{ total: number }>())!;

    return +project.count - +totalLoadForTaskType.total!;
  }
}
