import {
  Client,
  ClientsRepository,
  Competence,
  CompetencesRepository,
  Project,
  ProjectsRepository,
  Task,
  TasksRepository,
} from '@TaskM/core/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ClientsService } from '@TaskM/clients/api';
import { ProjectTaskStatusManagerService } from '@TaskM/shared/api';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Client, Task, Competence])],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectTaskStatusManagerService,
    ProjectsRepository,
    ClientsService,
    ClientsRepository,
    CompetencesRepository,
    TasksRepository,
  ],
  exports: [ProjectsService],
})
export class ProjectsApiModule {}
