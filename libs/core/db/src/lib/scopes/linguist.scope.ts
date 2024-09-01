import { SelectQueryBuilder } from 'typeorm';
import { Linguist } from '../entities';
import { OrderType } from '@TaskM/core/types';
import { TaskTypeCode } from '@TaskM/core/constants';

export class LinguistsScope extends SelectQueryBuilder<Linguist> {
  filterById(id: string) {
    return this.andWhere('Linguists.id = :id', {
      id,
    });
  }

  filterByEmail(email: string) {
    return this.andWhere('Linguists.email = :email', {
      email,
    });
  }

  filterByName(name: string) {
    return this.andWhere(
      "(Linguists.firstName ILIKE :name OR Linguists.lastName ILIKE :name OR CONCAT(Linguists.firstName, ' ', Linguists.lastName) ILIKE :name )",
      {
        name: `%${name}%`,
      },
    );
  }

  _orderBy(order: OrderType = 'DESC') {
    return this.addOrderBy(`Linguists.firstName`, order).addOrderBy(
      `Linguists.lastName`,
      order,
    );
  }

  joinCompetences() {
    return this.leftJoinAndSelect(
      'Linguists.competences',
      'competences',
      'competences.active = :active',
      { active: true },
    );
  }

  filterByCompetenceCode(code: TaskTypeCode) {
    return this.andWhere(
      '(competences.code = :code AND competences.active = true)',
      {
        code,
      },
    );
  }
}
