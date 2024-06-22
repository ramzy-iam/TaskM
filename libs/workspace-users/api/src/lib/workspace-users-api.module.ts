import { Module } from '@nestjs/common';
import { WorkspaceUsersService } from './workspace-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  UsersRepository,
  WorkspaceUser,
  WorkspaceUsersRepository,
} from '@TaskM/core/db';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceUser, User])],
  providers: [WorkspaceUsersService, WorkspaceUsersRepository, UsersRepository],
  exports: [WorkspaceUsersService],
})
export class WorkspaceUsersApiModule {}
