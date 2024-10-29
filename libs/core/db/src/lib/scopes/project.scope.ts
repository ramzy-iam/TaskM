import { SelectQueryBuilder } from 'typeorm';
import { Project } from '../entities';
import { OrderType } from '@TaskM/core/types';
import {
  ProjectDateFilterField,
  ProjectStatusCode,
  TaskTypeCode,
} from '@TaskM/core/constants';

export class ProjectsScope extends SelectQueryBuilder<Project> {
  filterById(id: string) {
    return this.andWhere('Projects.id = :id', {
      id,
    });
  }

  filterByPoId(poId: string) {
    return this.andWhere('Projects.poId = :poId', {
      poId,
    });
  }
  filterByClientPoId(clientPoId: string) {
    return this.andWhere('Projects.clientPoId = :clientPoId', {
      clientPoId,
    });
  }

  filterByClientId(clientId: string) {
    return this.andWhere('Projects.clientId = :clientId', {
      clientId,
    });
  }

  filterByClientCode(clientCode: string) {
    return this.andWhere(`client.code = :clientCode`, {
      clientCode,
    });
  }

  filterByName(name: string) {
    return this.andWhere(
      '(Projects.name ILIKE :name OR Projects.poId ILIKE :name)',
      {
        name: `%${name}%`,
      },
    );
  }

  filterByDate(
    from?: Date | null,
    to?: Date | null,
    dateField: ProjectDateFilterField | null = ProjectDateFilterField.CREATED_AT,
  ) {
    if (from && to)
      return this.andWhere(
        `DATE("Projects"."${dateField}") BETWEEN DATE(:from) AND DATE(:to)`,
        {
          from,
          to,
        },
      );
    if (from)
      return this.andWhere(`DATE("Projects"."${dateField}") >= DATE(:from)`, {
        from,
      });
    if (to)
      return this.andWhere(`DATE("Projects"."${dateField}") <= DATE(:to)`, {
        to,
      });

    return this;
  }

  _orderBy(
    field: string = ProjectDateFilterField.CREATED_AT,
    order: OrderType = 'DESC',
  ) {
    return this.addOrderBy(`Projects.${field}`, order);
  }

  filterByStatus(status: ProjectStatusCode) {
    return this.andWhere('Projects.status = :status', {
      status,
    });
  }

  filterByTaskType(taskType: TaskTypeCode) {
    return this.andWhere('Projects.taskType = :taskType', {
      taskType,
    });
  }

  joinClient() {
    return this.leftJoinAndSelect('Projects.client', 'client');
  }
}
