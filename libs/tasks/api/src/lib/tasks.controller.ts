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
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  TaskDto,
  UpdateTaskDto,
  TasksFilterDto,
  PaginationDto,
  TaskPreviewDto,
  TaskRemainingLoadDto,
} from '@TaskM/core/dto';
import { Serialize } from '@TaskM/core/interceptors';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Task } from '@TaskM/core/db';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Serialize(TaskDto)
  @Post()
  create(@Body() taskDto: CreateTaskDto) {
    return this.tasksService.create(taskDto);
  }

  @Serialize(TaskDto)
  @Patch(':id')
  update(@Param('id') id: string, @Body() taskDto: UpdateTaskDto) {
    return this.tasksService.update(id, taskDto);
  }

  @Serialize(new PaginationDto<TaskPreviewDto>(TaskPreviewDto))
  @Get()
  findAll(@Query() filters: TasksFilterDto) {
    return this.tasksService.findAll<Pagination<Task>>(filters);
  }

  @Serialize(TaskDto)
  @Get('one')
  findOne(@Query() filters: TasksFilterDto) {
    return this.tasksService.findOne(filters);
  }

  @Get('remaining-load')
  getRemainingLoad(@Query() filters: TaskRemainingLoadDto) {
    const { projectId, task, excludedTaskIds } = filters;
    return this.tasksService.getRemainingLoad(projectId, task, excludedTaskIds);
  }

  @Serialize(TaskDto)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.tasksService.getOne(id);
  }
}
