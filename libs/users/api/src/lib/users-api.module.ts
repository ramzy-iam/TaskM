import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Role,
  User,
  UsersRepository,
  Workspace,
  WorkspaceUser,
  WorkspaceUsersRepository,
} from '@TaskM/core/db';
import { UsersController } from './users.controller';
import { WorkspaceUsersService } from '@TaskM/workspace-users/api';

@Module({
  imports: [TypeOrmModule.forFeature([User, Workspace, WorkspaceUser, Role])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    WorkspaceUsersService,
    WorkspaceUsersRepository,
  ],
  exports: [UsersService],
})
export class UsersApiModule {}
