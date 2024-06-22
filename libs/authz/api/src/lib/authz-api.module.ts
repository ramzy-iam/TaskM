import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslSubject, Permission, PermissionsRepository, RolePermission, User, UsersRepository, WorkspaceUser, WorkspaceUsersRepository } from '@TaskM/core/db';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PermissionsGuard } from './permissions.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsService } from './permissions.services';
import { WorkspaceUsersService } from '@TaskM/workspace-users/api';

@Module({
  imports: [TypeOrmModule.forFeature([Permission,WorkspaceUser, User, CaslSubject, RolePermission])],
  controllers: [],
  providers: [
    CaslAbilityFactory,
    PermissionsGuard,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    PermissionsService,
    WorkspaceUsersService,
    PermissionsRepository,
    WorkspaceUsersRepository,
    UsersRepository,
  ],
  exports: [],
})
export class AuthzApiModule {}
