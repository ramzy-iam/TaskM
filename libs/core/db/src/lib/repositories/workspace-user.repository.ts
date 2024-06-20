import { WorkspaceUsersScope } from '../scopes';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace, WorkspaceUser } from '../entities';

@Injectable()
export class WorkspaceUsersRepository extends Repository<WorkspaceUser> {
  constructor(
    @InjectRepository(WorkspaceUser)
    private readonly _repository: Repository<WorkspaceUser>
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new WorkspaceUsersScope(
      this._repository.createQueryBuilder('WorkspaceUsers')
    );
  }
}
