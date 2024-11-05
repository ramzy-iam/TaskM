import {
  Body,
  Controller,
  Get,
  Param,
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

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Serialize(ProjectDto)
  @Post()
  create(@Body() projectDto: CreateProjectDto) {
    return this.projectsService.create(projectDto);
  }

  @Serialize(ProjectDto)
  @Patch(':id')
  update(@Param('id') id: string, @Body() projectDto: UpdateProjectDto) {
    return this.projectsService.update(id, projectDto);
  }

  @Serialize(new PaginationDto<ProjectPreviewDto>(ProjectPreviewDto))
  @Get()
  findAll(@Query() filters: ProjectsFilterDto) {
    return this.projectsService.findAll<Pagination<Project>>(filters);
  }

  @Serialize(ProjectDto)
  @Get('one')
  findOne(@Query() filters: ProjectsFilterDto) {
    return this.projectsService.findOne(filters);
  }

  @Serialize(ProjectDto)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.projectsService.getOne(id);
  }
}
