import { User } from '@task-manager/core/db';
import { SelectQueryBuilder } from 'typeorm';

export class UsersScope extends SelectQueryBuilder<User> {
  filterById(userId: number): UsersScope {
    return this.andWhere('Users.id = :id', {
      id: userId,
    });
  }

  filterByName(name: string): UsersScope {
    return this.andWhere(
      'Users.firstName ILIKE :name OR  Users.lastName ILIKE :name',
      {
        name: `%${name}%`,
      }
    );
  }

  filterByEmail(email: string): UsersScope {
    return this.andWhere('Users.email ILIKE :email', {
      email: `%${email}%`,
    });
  }
}
