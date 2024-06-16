import { Injectable } from '@nestjs/common';
import { UserListFilter } from '@task-manager/users/types';
import { User, UsersRepository } from '@task-manager/core/db';
import { UtilsHelper } from '@task-manager/core/helpers';
import { CreateUserDto } from '@task-manager/core/dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  create(userDto: CreateUserDto) {
    const newUser = this.usersRepository.create(userDto);
    return this.usersRepository.save(newUser);
  }

  findAll({ name, email }: UserListFilter) {
    const query = this.usersRepository.scoped;

    if (name) {
      query.filterByName(name);
    }

    if (email) {
      query.filterByEmail(email);
    }

    return query.getMany();
  }

  findOne({ email, id }: UserListFilter) {
    const query = this.usersRepository.scoped;

    if (id) {
      query.filterById(id);
    }

    if (email) {
      query.filterByEmail(email);
    }

    return query.getOne();
  }

  get(id: number) {
    return this.usersRepository.scoped.filterById(id).getOneOrFail();
  }

  async delete(id: number) {
    await this.get(id);
    return this.usersRepository.softDelete({ id });
  }

  async update(id: number, updatedUser: Partial<User>) {
    await this.get(id);
    return this.usersRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(updatedUser)
    );
  }
}
