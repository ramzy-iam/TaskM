import { Injectable } from '@nestjs/common';
import { UserListFilter } from '@task-manager/users/types';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './users.dto';
import { User } from '@task-manager/core/db';
import { convertUndefinedToNull } from '@task-manager/core/helpers';

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

  findOne({ email }: UserListFilter) {
    const query = this.usersRepository.scoped;

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
      convertUndefinedToNull(updatedUser)
    );
  }
}
