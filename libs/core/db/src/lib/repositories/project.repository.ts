import { ProjectsScope } from '../scopes';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities';

@Injectable()
export class ProjectsRepository extends Repository<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly _repository: Repository<Project>
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new ProjectsScope(this._repository.createQueryBuilder('Projects'));
  }
}
