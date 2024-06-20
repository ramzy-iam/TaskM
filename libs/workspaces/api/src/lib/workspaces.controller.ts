import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import {
  CreateWorkspaceDto,
  InviteUserToWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceDto,
} from '@task-manager/core/dto';
import { CurrentUser } from '@task-manager/core/decorators';
import { User } from '@task-manager/core/db';
import { UsersService } from '@task-manager/users/api';
import { Serialize } from '@task-manager/core/interceptors';

@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private workspacesService: WorkspacesService,
    private usersService: UsersService
  ) {}

  @Post()
  create(@Body() workspaceDto: CreateWorkspaceDto, @CurrentUser() user: User) {
    return this.workspacesService.create(workspaceDto, user.id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.workspacesService.getOne(id);
  }

  @Serialize(WorkspaceDto)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() workspaceDto: UpdateWorkspaceDto
  ) {
    return this.workspacesService.update(id, workspaceDto);
  }

  @Post(':id/invitations')
  async invitations(
    @Param('id', ParseIntPipe) id: number,
    @Body() invitations: InviteUserToWorkspaceDto
  ) {
    return this.usersService.inviteUsers(
      id,
      invitations.emails,
      invitations.roleId
    );
  }
}
