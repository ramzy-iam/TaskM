import { SelectQueryBuilder } from 'typeorm';
import { Project } from '../entities';
import { OrderType } from '@TaskM/core/types';
import {
  ProjectDateFilterField,
  ProjectStatus,
  TaskType,
} from '@TaskM/core/constants';

export class ProjectsScope extends SelectQueryBuilder<Project> {
  filterById(id: number) {
    return this.andWhere('Projects.id = :id', {
      id,
    });
  }

  filterByPoId(poId: string) {
    return this.andWhere('Projects.poId = :poId', {
      poId,
    });
  }

  filterByClientId(clientId: number) {
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
    dateField: ProjectDateFilterField = ProjectDateFilterField.CREATED_AT
  ) {
    if (from && to)
      return this.andWhere(
        `DATE("Projects"."${dateField}") BETWEEN DATE(:from) AND DATE(:to)`,
        {
          from,
          to,
        }
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
    order: OrderType = 'DESC'
  ) {
    return this.addOrderBy(field, order);
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
}
