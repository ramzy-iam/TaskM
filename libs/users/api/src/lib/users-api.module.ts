import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User, Workspace, WorkspaceUser } from '@task-manager/core/db';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Workspace, WorkspaceUser, Role])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersApiModule {}
