import { CompetencesScope } from '../scopes';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Competence } from '../entities';

@Injectable()
export class CompetencesRepository extends Repository<Competence> {
  constructor(
    @InjectRepository(Competence)
    private readonly _repository: Repository<Competence>,
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new CompetencesScope(
      this._repository.createQueryBuilder('Competences'),
    );
  }
}
