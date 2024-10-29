import { ServiceProvidersScope } from '../scopes';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProvider } from '../entities';

@Injectable()
export class ServiceProvidersRepository extends Repository<ServiceProvider> {
  constructor(
    @InjectRepository(ServiceProvider)
    private readonly _repository: Repository<ServiceProvider>,
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new ServiceProvidersScope(this._repository.createQueryBuilder('ServiceProviders'));
  }
}
