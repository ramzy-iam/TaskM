import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ClientsService } from '@TaskM/clients/api';
import { ProjectDateFilterField, TaskTypeCode } from '@TaskM/core/constants';
import { Project, ProjectsRepository } from '@TaskM/core/db';
import {
  ProjectsFilterDto,
  CreateProjectDto,
  UpdateProjectDto,
} from '@TaskM/core/dto';
import { DayjsHelper, UtilsHelper } from '@TaskM/core/helpers';
import { paginateResult } from '@TaskM/core/helpers/backend';

@Injectable()
export class ProjectsService {
  constructor(
    private projectsRepository: ProjectsRepository,
    private clientsService: ClientsService,
  ) {}

  async create(projectDto: CreateProjectDto) {
    const client = await this.clientsService.findOne({
      code: projectDto.client?.code,
      clientId: projectDto.client?.id,
    });
    if (!client)
      throw new BadRequestException(
        `Client with code '${projectDto.client?.code}' not found`,
      );

    await this.validateBeforeCreateOrUpdate(projectDto.clientPoId);

    const project = this.projectsRepository.create(projectDto);
    const { poId } = await this.generateSpecialFields(
      project.taskType,
      project.clientId,
    );

    project.poId = poId;
    project.client = client;

    return this.projectsRepository.save(project);
  }

  getOne(id: string) {
    return this.projectsRepository.scoped
      .filterById(id)
      .joinClient()
      .getOneOrFail();
  }

  async update(id: string, projectDto: UpdateProjectDto) {
    await this.validateBeforeCreateOrUpdate(projectDto.name);

    await this.projectsRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(projectDto),
    );
    return this.getOne(id);
  }

  private async validateBeforeCreateOrUpdate(
    clientPoId?: string,
    projectId?: string,
  ) {
    if (!clientPoId) return;
    const existingProject = await this.projectsRepository.scoped
      .filterByClientPoId(clientPoId)
      .getOne();

    if (existingProject && (!projectId || existingProject.id !== projectId))
      throw new ConflictException(
        `There is already a project with the ClientPO ID '${clientPoId}'`,
      );
  }

  findAll<P = Project[]>(filters?: ProjectsFilterDto) {
    const query = this.projectsRepository.scoped;
    if (filters?.query) query.filterByName(filters?.query);
    if (filters?.withDeleted) query.withDeleted();
    if (filters?.clientId) query.filterByClientId(filters?.clientId);
    if (filters?.clientCode) query.filterByClientCode(filters?.clientCode);
    if (filters?.task) query.filterByTaskType(filters?.task);
    if (filters?.status) query.filterByStatus(filters?.status);
    if (filters?.poId) query.filterByPoId(filters?.poId);

    query
      .joinClient()
      .filterByDate(filters?.from, filters?.to, filters?.dateField)
      ._orderBy(filters?.orderField, filters?.order);

    return (
      filters?.page && filters?.limit
        ? paginateResult(query, { page: filters?.page, limit: filters.limit })
        : query.getMany()
    ) as Promise<P>;
  }

  private async generateSpecialFields(
    taskType: TaskTypeCode,
    clientId: string,
  ) {
    const client = await this.clientsService.getOne(clientId);
    const today = DayjsHelper.new();
    const from = today.startOf('M').toDate();
    const to = today.endOf('M').toDate();
    const monthProjectCount = await this.projectsRepository.scoped
      .filterByDate(from, to, ProjectDateFilterField.CREATED_AT)
      .filterByClientId(clientId)
      .withDeleted()
      .getCount();

    const todayFormatted = today.format('YYMMDD');

    const newNumber = (monthProjectCount + 1).toString().padStart(3, '0');
    const poId = `${client.code}-${todayFormatted}-${taskType}-${newNumber}`;

    return { poId };
  }
  findOne(filters?: ProjectsFilterDto) {
    const query = this.projectsRepository.scoped;
    if (filters?.id) query.filterById(filters?.id);
    if (filters?.poId) query.filterByPoId(filters?.poId);

    return query.joinClient().getOne();
  }
}
