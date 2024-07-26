import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  ProjectDto,
  UpdateProjectDto,
  ProjectsFilterDto,
  PaginationDto,
  ProjectPreviewDto,
} from '@TaskM/core/dto';
import { Serialize } from '@TaskM/core/interceptors';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Project } from '@TaskM/core/db';
import { PaginationMeta } from '@TaskM/core/types';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Serialize(ProjectDto)
  @Post()
  create(@Body() projectDto: CreateProjectDto) {
    return this.projectsService.create(projectDto);
  }

  @Serialize(ProjectDto)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getOne(id);
  }

  @Serialize(ProjectDto)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() projectDto: UpdateProjectDto
  ) {
    return this.projectsService.update(id, projectDto);
  }

  @Serialize(new PaginationDto<ProjectPreviewDto>(ProjectPreviewDto))
  @Get()
  findAll(@Query() filters: ProjectsFilterDto) {
    return this.projectsService.findAll<Pagination<Project>>(filters);
  }
}
