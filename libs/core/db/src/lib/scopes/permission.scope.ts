import { StateUser } from '@TaskM/users/types';
import { Permission } from '../entities';
import { SelectQueryBuilder } from 'typeorm';

export class PermissionsScope extends SelectQueryBuilder<Permission> {
  joinWorkspaceUser(): PermissionsScope {
    return this.innerJoin('Permissions.rolePermissions', 'rolePermissions')
      .innerJoinAndSelect('Permissions.permissionSubject', 'subjects')
      .innerJoin('rolePermissions.role', 'roles')
      .innerJoin('roles.workspaceUsers', 'workspaceUsers')
      .andWhere('workspaceUsers.state = :state', {
        state: StateUser.CONFIRMED,
      });
  }

  filterByWorkspaceId(workspaceId: number): PermissionsScope {
    return this.andWhere('workspaceUsers.workspaceId = :workspaceId', {
      workspaceId,
    });
  }

  filterByUserId(userId: number): PermissionsScope {
    return this.andWhere('workspaceUsers.userId = :userId', {
      userId,
    });
  }
}
