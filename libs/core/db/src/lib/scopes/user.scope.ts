import { SelectQueryBuilder } from 'typeorm';
import { User } from '../entities';

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
    return this.andWhere('Users.email = :email', {
      email,
    });
  }

  filterByVerificationToken(token: string): UsersScope {
    return this.andWhere('Users.token = :token', {
      token,
    });
  }
}
