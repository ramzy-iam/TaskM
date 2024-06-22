import { PermissionsScope } from '../scopes';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities';

@Injectable()
export class PermissionsRepository extends Repository<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly _repository: Repository<Permission>
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  get scoped() {
    return new PermissionsScope(
      this._repository.createQueryBuilder('Permissions')
    );
  }
}
