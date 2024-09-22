import { TasksScope } from '../scopes';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    private readonly _repository: Repository<Task>,
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new TasksScope(this._repository.createQueryBuilder('Tasks'));
  }
}
