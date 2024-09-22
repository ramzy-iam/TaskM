import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TasksRepository } from '@TaskM/core/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsApiModule } from '@TaskM/projects/api';
import { CompetencesApiModule } from '@TaskM/competences/api';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ProjectsApiModule,
    CompetencesApiModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksApiModule {}
