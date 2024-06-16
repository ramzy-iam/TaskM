import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from '@task-manager/core/dto';
import { CurrentUser } from '@task-manager/users/api';
import { User } from '@task-manager/core/db';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  create(@Body() workspaceDto: CreateWorkspaceDto, @CurrentUser() user: User) {
    return this.workspacesService.create(workspaceDto, user.id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.workspacesService.getOne(id, user.id);
  }
}
