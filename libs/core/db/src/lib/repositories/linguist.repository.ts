import { LinguistsScope } from '../scopes';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Linguist } from '../entities';

@Injectable()
export class LinguistsRepository extends Repository<Linguist> {
  constructor(
    @InjectRepository(Linguist)
    private readonly _repository: Repository<Linguist>,
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new LinguistsScope(this._repository.createQueryBuilder('Linguists'));
  }
}
