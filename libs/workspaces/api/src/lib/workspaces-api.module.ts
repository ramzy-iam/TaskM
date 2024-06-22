import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import {
  User,
  UsersRepository,
  Workspace,
  WorkspaceUser,
  WorkspaceUsersRepository,
  WorkspacesRepository,
} from '@TaskM/core/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@TaskM/users/api';
import { WorkspaceUsersService } from '@TaskM/workspace-users/api';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, User, WorkspaceUser])],
  controllers: [WorkspacesController],
  providers: [
    WorkspacesService,
    WorkspacesRepository,
    UsersService,
    UsersRepository,
    WorkspaceUsersService,
    WorkspaceUsersRepository,
  ],
  exports: [WorkspacesService],
})
export class WorkspacesApiModule {}
