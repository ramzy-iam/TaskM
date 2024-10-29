import { SelectQueryBuilder } from 'typeorm';
import { Competence, ServiceProvider } from '../entities';
import { OrderType } from '@TaskM/core/types';
import { TaskTypeCode } from '@TaskM/core/constants';

export class ServiceProvidersScope extends SelectQueryBuilder<ServiceProvider> {
  filterById(id: string) {
    return this.andWhere('ServiceProviders.id = :id', {
      id,
    });
  }

  filterByEmail(email: string) {
    return this.andWhere('ServiceProviders.email = :email', {
      email,
    });
  }

  filterByName(name: string) {
    return this.andWhere(
      "(ServiceProviders.firstName ILIKE :name OR ServiceProviders.lastName ILIKE :name OR CONCAT(ServiceProviders.firstName, ' ', ServiceProviders.lastName) ILIKE :name )",
      {
        name: `%${name}%`,
      },
    );
  }

  _orderBy(order: OrderType = 'DESC') {
    return this.addOrderBy(`ServiceProviders.firstName`, order).addOrderBy(
      `ServiceProviders.lastName`,
      order,
    );
  }

  joinCompetences() {
    return this.leftJoinAndSelect(
      'ServiceProviders.competences',
      'competences',
      'competences.active = :active',
      { active: true },
    );
  }

  filterByCompetenceCode(code: TaskTypeCode) {
    const subQuery = this.subQuery()
      .from(Competence, '_competences')
      .select('1')
      .where('_competences.serviceProviderId = ServiceProviders.id')
      .andWhere('_competences.code = :code', { code })
      .andWhere('_competences.active = true');

    return this.andWhere(`EXISTS (${subQuery.getQuery()})`);
  }
}
