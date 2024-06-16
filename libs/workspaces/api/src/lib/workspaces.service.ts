import { BadRequestException, Injectable } from '@nestjs/common';
import { ROLES } from '@task-manager/core/constants';
import { WorkspacesRepository } from '@task-manager/core/db';
import { CreateWorkspaceDto } from '@task-manager/core/dto';

@Injectable()
export class WorkspacesService {
  constructor(private workspacesRepository: WorkspacesRepository) {}

  async create(workspaceDto: CreateWorkspaceDto, userId: number) {
    const existingWorkspace = await this.workspacesRepository.scoped
      .filterByUserId(userId)
      .filterByName(workspaceDto.name)
      .getOne();

    if (existingWorkspace)
      throw new BadRequestException(
        `You already have a workspace with the name '${workspaceDto.name}'`
      );

    const workspace = this.workspacesRepository.create({
      ...workspaceDto,
      userId,
    });

    workspace.buildWorkspaceUserToSaveWithWorkspace(userId, [ROLES.ADMIN]);

    return this.workspacesRepository.save(workspace);
  }

  getOne(id: number, userId: number) {
    return this.workspacesRepository.scoped
      .filterById(id)
      .filterByUserId(userId)
      .getOneOrFail();
  }
}
