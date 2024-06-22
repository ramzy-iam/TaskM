import { Injectable } from '@nestjs/common';
import { Permission, PermissionsRepository } from '@TaskM/core/db';

@Injectable()
export class PermissionsService {
  constructor(private permissionRepository: PermissionsRepository) {}
  findAll(userId: number, workspaceId?: number): Promise<Permission[]> {
    const query = this.permissionRepository.scoped.filterByUserId(userId);

    if (workspaceId) query.filterByWorkspaceId(workspaceId);

    return query.joinWorkspaceUser().getMany();
  }
}
