import { Competence, CompetencesRepository } from '@TaskM/core/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetencesService } from './competences.service';
import { CompetencesController } from './competences.controller';

@Module({
  controllers: [CompetencesController],
  imports: [TypeOrmModule.forFeature([Competence])],
  providers: [CompetencesRepository, CompetencesService],
})
export class CompetencesApiModule {}
