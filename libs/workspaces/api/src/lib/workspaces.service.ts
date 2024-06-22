import { ConflictException, Injectable } from '@nestjs/common';
import { ROLES } from '@TaskM/core/constants';
import { Workspace, WorkspacesRepository } from '@TaskM/core/db';
import { CreateWorkspaceDto } from '@TaskM/core/dto';
import { UtilsHelper } from '@TaskM/core/helpers';

@Injectable()
export class WorkspacesService {
  constructor(private workspacesRepository: WorkspacesRepository) {}

  async create(workspaceDto: CreateWorkspaceDto, userId: number) {
    const existingWorkspace = await this.workspacesRepository.scoped
      .filterByName(workspaceDto.name)
      .getOne();

    if (existingWorkspace)
      throw new ConflictException(
        `There is already a workspace with the name '${workspaceDto.name}'`
      );

    const workspace = this.workspacesRepository.create({
      ...workspaceDto,
    });

    workspace.buildWorkspaceUserToSaveWithWorkspace(userId, [ROLES.Admin]);

    return this.workspacesRepository.save(workspace);
  }

  getOne(id: number) {
    return this.workspacesRepository.scoped.filterById(id).getOneOrFail();
  }

  async update(id: number, workspaceUpdate: Partial<Workspace>) {
    await this.workspacesRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(workspaceUpdate)
    );
    return this.getOne(id);
  }

  async validateBeforeCreateOrUpdate(name: string, workspaceId?: number) {
    const existingWorkspace = await this.workspacesRepository.scoped
      .filterByName(name)
      .getOne();

    if (existingWorkspace && existingWorkspace.id !== workspaceId)
      throw new ConflictException(
        `There is already a workspace with the name '${name}'`
      );
  }
}
