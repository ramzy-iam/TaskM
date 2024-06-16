import { WorkspacesScope } from '../scopes';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from '../entities';

@Injectable()
export class WorkspacesRepository extends Repository<Workspace> {
  constructor(
    @InjectRepository(Workspace)
    private readonly _repository: Repository<Workspace>
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new WorkspacesScope(
      this._repository.createQueryBuilder('Workspaces')
    );
  }
}
