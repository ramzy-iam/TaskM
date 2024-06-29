import { ClientsScope } from '../scopes';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entities';

@Injectable()
export class ClientsRepository extends Repository<Client> {
  constructor(
    @InjectRepository(Client)
    private readonly _repository: Repository<Client>
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new ClientsScope(this._repository.createQueryBuilder('Clients'));
  }
}
