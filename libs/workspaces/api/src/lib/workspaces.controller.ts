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
} from '@TaskM/core/dto';
import { CurrentUser } from '@TaskM/core/decorators';
import { User } from '@TaskM/core/db';
import { UsersService } from '@TaskM/users/api';
import { Serialize } from '@TaskM/core/interceptors';
import { PermissionAction, PermissionSubject } from '@TaskM/core/types';
import { CheckPermissions } from '@TaskM/authz/api';

@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private workspacesService: WorkspacesService,
    private usersService: UsersService,
  ) {}

  @Post()
  create(@Body() workspaceDto: CreateWorkspaceDto, @CurrentUser() user: User) {
    return this.workspacesService.create(workspaceDto, user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.workspacesService.getOne(id);
  }

  @CheckPermissions([PermissionAction.UPDATE, PermissionSubject.WORKSPACE])
  @Serialize(WorkspaceDto)
  @Patch(':id')
  update(@Param('id') id: string, @Body() workspaceDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(id, workspaceDto);
  }

  @CheckPermissions([PermissionAction.INVITE, PermissionSubject.USER])
  @Post(':id/invitations')
  async invitations(
    @Param('id') id: string,
    @Body() invitations: InviteUserToWorkspaceDto,
  ) {
    return this.usersService.inviteUsers(
      id,
      invitations.emails,
      invitations.roleId,
    );
  }
}
