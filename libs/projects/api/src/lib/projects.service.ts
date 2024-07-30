import { ConflictException, Injectable } from '@nestjs/common';
import { ClientsService } from '@TaskM/clients/api';
import { ProjectDateFilterField } from '@TaskM/core/constants';
import { Project, ProjectsRepository } from '@TaskM/core/db';
import {
  ProjectsFilterDto,
  CreateProjectDto,
  UpdateProjectDto,
} from '@TaskM/core/dto';
import { DayjsHelper, paginateResult, UtilsHelper } from '@TaskM/core/helpers';

@Injectable()
export class ProjectsService {
  constructor(
    private projectsRepository: ProjectsRepository,
    private clientsService: ClientsService,
  ) {}

  async create(projectDto: CreateProjectDto) {
    await this.validateBeforeCreateOrUpdate(projectDto.poId);

    const project = this.projectsRepository.create(projectDto);
    const { internalPoId } = await this.generateSpecialFields(project.clientId);

    project.internalPoId = internalPoId;

    return this.projectsRepository.save(project);
  }

  getOne(id: string) {
    return this.projectsRepository.scoped.filterById(id).getOneOrFail();
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
    poId?: string,
    projectId?: number,
  ) {
    if (!poId) return;
    const existingProject = await this.projectsRepository.scoped
      .filterByPoId(poId)
      .getOne();

    if (existingProject && (!projectId || existingProject.id !== projectId))
      throw new ConflictException(
        `There is already a project with the PO ID '${poId}'`,
      );
  }

  findAll<P = Project[]>(filters?: ProjectsFilterDto) {
    const query = this.projectsRepository.scoped;
    if (filters?.query) query.filterByName(filters?.query);
    if (filters?.withDeleted) query.withDeleted();
    if (filters?.clientId) query.filterByClientId(filters?.clientId);
    if (filters?.taskType) query.filterByTaskType(filters?.taskType);
    if (filters?.status) query.filterByStatus(filters?.status);

    query
      .filterByDate(filters?.from, filters?.to, filters?.dateField)
      ._orderBy(filters?.orderField, filters?.order);

    return (
      filters?.page && filters?.limit
        ? paginateResult(query, { page: filters?.page, limit: filters.limit })
        : query.getMany()
    ) as Promise<P>;
  }

  private async generateSpecialFields(clientId: number) {
    const client = await this.clientsService.getOne(clientId);
    const today = DayjsHelper.new();
    const from = today.endOf('M').toDate();
    const to = today.startOf('M').toDate();
    const monthProjectCount = await this.projectsRepository.scoped
      .filterByDate(from, to, ProjectDateFilterField.CREATED_AT)
      .filterByClientId(clientId)
      .withDeleted()
      .getCount();

    const year = today.format('YY');
    const month = today.format('MM');
    const day = today.format('DD');

    const poId = `${client.code}${year}${month}${day}`;
    const newNumber = (monthProjectCount + 1).toString().padStart(4, '0');

    return { internalPoId: `${newNumber}. ${poId}-${newNumber}` };
  }
}
