import { SelectQueryBuilder } from 'typeorm';
import { Client } from '../entities';

export class ClientsScope extends SelectQueryBuilder<Client> {
  filterById(id: number): ClientsScope {
    return this.andWhere('Clients.id = :id', {
      id,
    });
  }

  filterByCode(code: string): ClientsScope {
    return this.andWhere('Clients.code = :code', {
      code,
    });
  }

  filterByName(name: string): ClientsScope {
    return this.andWhere('Clients.name ILIKE :name', {
      name: `%${name}%`,
    });
  }
}
