import {
  ForcedSubject,
  MongoAbility,
  RawRuleOf,
  createMongoAbility,
} from '@casl/ability';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { WorkspaceUsersService } from '@TaskM/workspace-users/api';
import { Permission, User, Workspace } from '@TaskM/core/db';
import { PermissionsService } from './permissions.services';
import { PermissionAction, PermissionSubject } from '@TaskM/core/types';

interface CaslPermission {
  action: PermissionAction;
  subject: PermissionSubject;
  condition?: object;
}

export const actions = [...Object.values(PermissionAction)] as const;

const subjects = Object.values(PermissionSubject);

export type Abilities = [(typeof actions)[number], (typeof subjects)[number]];

export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class CaslAbilityFactory {
  createAbility = (rules: RawRuleOf<AppAbility>[]) =>
    createMongoAbility<AppAbility>(rules);

  constructor(
    @Inject(forwardRef(() => PermissionsService))
    private permissionsService: PermissionsService,
    private workspaceUsersService: WorkspaceUsersService
  ) {}
  async createForUser(
    user: User & { currentWorkspace: Partial<Workspace> },
    workspaceId: number
  ): Promise<AppAbility> {
    let caslPermissions: CaslPermission[] = [];

    const workspaceUser = await this.workspaceUsersService.findOne(
      workspaceId,
      user.id
    );

    if (workspaceUser && workspaceUser.roles?.length === 1) {
      const dbPermissions: Permission[] = await this.permissionsService.findAll(
        user.id,
        workspaceId
      );

      caslPermissions = JSON.parse(
        JSON.stringify(
          dbPermissions.map((p) => ({
            action: p.action,
            subject: p.permissionSubject.name,
            conditions: Permission.parseCondition(p.conditions, {
              id: user.id,
            }),
          }))
        )
      );
    }

    return this.createAbility(Object(caslPermissions));
  }
}
