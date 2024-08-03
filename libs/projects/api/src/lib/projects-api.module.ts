import {
  Client,
  ClientsRepository,
  Project,
  ProjectsRepository,
} from '@TaskM/core/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ClientsService } from '@TaskM/clients/api';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Client])],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository, ClientsRepository],
  exports: [ProjectsService, ClientsService],
})
export class ProjectsApiModule {}
