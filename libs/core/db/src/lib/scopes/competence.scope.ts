import { SelectQueryBuilder } from 'typeorm';
import { Competence } from '../entities';
import { OrderType } from '@TaskM/core/types';
import { Currency, LoadUnit, TaskTypeCode } from '@TaskM/core/constants';

export class CompetencesScope extends SelectQueryBuilder<Competence> {
  filterById(id: string) {
    return this.andWhere('"Competences"."id" = :id', {
      id,
    });
  }

  filterByServiceProviderId(serviceProviderId: string) {
    return this.andWhere('Competences.serviceProviderId = :serviceProviderId', {
      serviceProviderId,
    });
  }

  filterByCode(code: TaskTypeCode) {
    return this.andWhere('Competences.code = :code', {
      code,
    });
  }

  filterByUnit(unit: LoadUnit) {
    return this.andWhere('Competences.unit = :unit', {
      unit,
    });
  }

  filterByCurrency(currency: Currency) {
    return this.andWhere('Competences.currency = :currency', {
      currency,
    });
  }

  filterByRate(rate: number) {
    return this.andWhere('Competences.rate = :rate', {
      rate,
    });
  }

  filterByActive(active?: boolean) {
    if (typeof active === 'undefined') return this;
    return this.andWhere('Competences.active = :active', {
      active,
    });
  }

  order(order: OrderType = 'DESC') {
    return this.addOrderBy(`"Competences"."code"`, order);
  }
}
