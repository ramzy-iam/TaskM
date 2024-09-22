import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompetencesService } from './competences.service';
import {
  CompetencePreviewDto,
  CompetencesFilterDto,
  CreateCompetenceDto,
  PaginationDto,
  UpdateCompetenceDto,
} from '@TaskM/core/dto';
import { Serialize } from '@TaskM/core/interceptors';

@Controller('competences')
export class CompetencesController {
  constructor(private competencesService: CompetencesService) {}

  @Post()
  create(@Body() competenceDto: CreateCompetenceDto) {
    return this.competencesService.create(competenceDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() competenceDto: UpdateCompetenceDto) {
    return this.competencesService.update(id, competenceDto);
  }
  @Get('id')
  getOne(@Param('id') id: string) {
    return this.competencesService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.competencesService.delete(id);
  }

  @Serialize(new PaginationDto<CompetencePreviewDto>(CompetencePreviewDto))
  @Get()
  findAll(@Query() filters?: CompetencesFilterDto) {
    return this.competencesService.findAll(filters);
  }
}
