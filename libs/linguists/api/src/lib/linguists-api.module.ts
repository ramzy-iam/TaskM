import { Module } from '@nestjs/common';
import { LinguistsService } from './linguists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competence, Linguist, LinguistsRepository } from '@TaskM/core/db';
import { LinguistsController } from './linguists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Linguist, Competence])],
  controllers: [LinguistsController],
  providers: [LinguistsService, LinguistsRepository],
})
export class LinguistsApiModule {}
