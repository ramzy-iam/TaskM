import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFilter } from '@task-manager/users/types';
import { Serialize } from '@task-manager/core/interceptors';
import { ConfirmInvitationDto, UserDto } from '@task-manager/core/dto';
import { PublicRoute } from '@task-manager/core/decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Serialize(UserDto)
  @Get()
  findAll(@Query() filters: UserFilter) {
    return this.usersService.findAll(filters);
  }

  @Serialize(UserDto)
  @Get(':id')
  get(@Param('id') id: number) {
    return this.usersService.get(id);
  }

  @PublicRoute()
  @Post('confirm-invitation')
  async confirmInvitation(@Body() userDto: ConfirmInvitationDto) {
    return this.usersService.confirmInvitationUser(userDto.tokenInvitation);
  }
}
