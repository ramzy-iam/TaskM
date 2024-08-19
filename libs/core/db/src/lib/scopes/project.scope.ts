import { SelectQueryBuilder } from 'typeorm';
import { Project } from '../entities';
import { OrderType } from '@TaskM/core/types';
import {
  ProjectDateFilterField,
  ProjectStatus,
  TaskType,
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

  filterByName(name: string) {
    return this.andWhere('Projects.name ILIKE :name', {
      name: `%${name}%`,
    });
  }

  filterByDate(
    from?: Date,
    to?: Date,
    dateField: ProjectDateFilterField = ProjectDateFilterField.CREATED_AT,
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

  filterByStatus(status: ProjectStatus) {
    return this.andWhere('Projects.status = :status', {
      status,
    });
  }

  filterByTaskType(taskType: TaskType) {
    return this.andWhere('Projects.taskType = :taskType', {
      taskType,
    });
  }

  joinClient() {
    return this.leftJoinAndSelect('Projects.client', 'client');
  }
}
