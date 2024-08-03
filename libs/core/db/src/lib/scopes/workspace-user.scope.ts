import { SelectQueryBuilder } from 'typeorm';
import { WorkspaceUser } from '../entities';

export class WorkspaceUsersScope extends SelectQueryBuilder<WorkspaceUser> {
  filterById(id: string): WorkspaceUsersScope {
    return this.andWhere('WorkspaceUsers.id = :id', {
      id: id,
    });
  }

  filterByUserId(userId: number): WorkspaceUsersScope {
    return this.andWhere('WorkspaceUsers.userId = :userId', {
      userId,
    });
  }

  filterByWorkspaceId(workspaceId: number): WorkspaceUsersScope {
    return this.andWhere('WorkspaceUsers.workspaceId = :workspaceId', {
      workspaceId,
    });
  }

  filterByEmail(email: string): WorkspaceUsersScope {
    return this.leftJoinAndSelect('WorkspaceUsers.user', 'user').andWhere(
      'user.email = :email',
      {
        email,
      },
    );
  }

  filterByTokenInvitation(tokenInvitation: string): WorkspaceUsersScope {
    return this.andWhere('WorkspaceUsers.tokenInvitation = :tokenInvitation', {
      tokenInvitation,
    });
  }

  joinWorkspace(): WorkspaceUsersScope {
    return this.leftJoinAndSelect('WorkspaceUsers.workspace', 'workspace');
  }

  joinRoles(): WorkspaceUsersScope {
    return this.leftJoinAndSelect('WorkspaceUsers.roles', 'roles');
  }
}
