import { User } from '@task-manager/core/db';
import { UsersScope } from './users.scope';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new UsersScope(this._repository.createQueryBuilder('Users'));
  }
}
