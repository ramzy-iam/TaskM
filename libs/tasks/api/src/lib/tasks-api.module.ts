import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import {
  Project,
  ProjectsRepository,
  Task,
  TasksRepository,
} from '@TaskM/core/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsApiModule } from '@TaskM/projects/api';
import { CompetencesApiModule } from '@TaskM/competences/api';
import { ProjectTaskStatusManagerService } from '@TaskM/shared/api';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project]),
    ProjectsApiModule,
    CompetencesApiModule,
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    ProjectTaskStatusManagerService,
    TasksRepository,
    ProjectsRepository,
  ],
})
export class TasksApiModule {}
