import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFilter } from '@TaskM/users/types';
import { Serialize } from '@TaskM/core/interceptors';
import { ConfirmInvitationDto, UserDto } from '@TaskM/core/dto';
import { PublicRoute } from '@TaskM/core/decorators';

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
