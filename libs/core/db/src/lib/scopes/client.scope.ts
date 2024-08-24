import { SelectQueryBuilder } from 'typeorm';
import { Client } from '../entities';
import { FilterByOperator } from '@TaskM/core/types';

export class ClientsScope extends SelectQueryBuilder<Client> {
  filterById(id: string) {
    return this.andWhere('Clients.id = :id', {
      id,
    });
  }

  filterByCode({
    code,
    strictOnCode = false,
    operatorCode = 'AND',
  }: {
    code: string;
    strictOnCode?: boolean;
    operatorCode?: FilterByOperator;
  }) {
    const operator =
      operatorCode === 'OR'
        ? this.orWhere.bind(this)
        : this.andWhere.bind(this);

    if (strictOnCode)
      return operator('(Clients.code = :code)', {
        code,
      });

    return operator('(Clients.code ILIKE :code)', {
      code: `%${code}%`,
    });
  }

  filterByName({
    name,
    operatorCode = 'AND',
  }: {
    name: string;
    operatorCode?: FilterByOperator;
  }) {
    const operator =
      operatorCode === 'OR'
        ? this.orWhere.bind(this)
        : this.andWhere.bind(this);

    return operator('(Clients.name ILIKE :name)', {
      name: `%${name}%`,
    });
  }
}
