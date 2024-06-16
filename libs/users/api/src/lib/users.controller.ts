import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFilter } from '@task-manager/users/types';
import { Serialize } from '@task-manager/core/interceptors';
import { UserDto } from './users.dto';

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
}
