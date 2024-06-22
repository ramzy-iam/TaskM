import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from './casl-ability.factory';
import {
  PERMISSION_CHECKER_KEY,
  RequiredPermission,
} from './ability.decorator';
import { PermissionAction, PermissionSubject } from '@TaskM/core/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(
        PERMISSION_CHECKER_KEY,
        context.getHandler()
      ) || [];

    if (!requiredPermissions || requiredPermissions.length < 1) return true;

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler()
    );

    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const workspaceId = req.params?.workspaceId;
    const ability = await this.abilityFactory.createForUser(user, workspaceId);

    // Check if the user has the ability to manage all resources
    if (ability.can(PermissionAction.MANAGE, PermissionSubject.ALL)) {
      return true;
    }

    return requiredPermissions.every((permission) =>
      this.isAllowed(ability, permission)
    );
  }

  private isAllowed(
    ability: AppAbility,
    permission: RequiredPermission
  ): boolean {
    return ability.can(...permission);
  }
}
