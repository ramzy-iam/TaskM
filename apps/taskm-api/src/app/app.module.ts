import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@TaskM/core/db';
import { ClientsApiModule } from '@TaskM/clients/api';
import { ProjectsApiModule } from '@TaskM/projects/api';
import { LinguistsApiModule } from '@TaskM/linguists/api';
import { CompetencesApiModule } from '@TaskM/competences/api';
import { TasksApiModule } from '@TaskM/tasks/api';

@Module({
  imports: [
    DatabaseModule,
    ClientsApiModule,
    ProjectsApiModule,
    LinguistsApiModule,
    CompetencesApiModule,
    TasksApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
