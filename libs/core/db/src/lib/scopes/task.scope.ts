import { SelectQueryBuilder } from 'typeorm';
import { Task } from '../entities';
import { OrderType } from '@TaskM/core/types';
import {
  TaskDateFilterField,
  TaskStatusCode,
  TaskTypeCode,
} from '@TaskM/core/constants';

export class TasksScope extends SelectQueryBuilder<Task> {
  filterById(id: string) {
    return this.andWhere('Tasks.id = :id', {
      id,
    });
  }

  filterByCode(code: string) {
    return this.andWhere('Tasks.code = :code', {
      code,
    });
  }

  filterByProjectId(projectId: string) {
    return this.andWhere('Tasks.projectId = :projectId', {
      projectId,
    });
  }

  filterByProjectCode(projectCode: string) {
    return this.andWhere('project.poId = :projectCode', {
      projectCode,
    });
  }

  filterByServiceProviderId(serviceProviderId: string) {
    return this.andWhere('Tasks.serviceProviderId = :serviceProviderId', {
      serviceProviderId,
    });
  }

  filterByProjectPoId(poId: string) {
    return this.andWhere(`project.poId = :poId`, {
      poId,
    });
  }

  filterByDate(
    from?: Date | null,
    to?: Date | null,
    dateField: TaskDateFilterField | null = TaskDateFilterField.CREATED_AT,
  ) {
    if (from && to)
      return this.andWhere(
        `DATE("Tasks"."${dateField}") BETWEEN DATE(:from) AND DATE(:to)`,
        {
          from,
          to,
        },
      );
    if (from)
      return this.andWhere(`DATE("Tasks"."${dateField}") >= DATE(:from)`, {
        from,
      });
    if (to)
      return this.andWhere(`DATE("Tasks"."${dateField}") <= DATE(:to)`, {
        to,
      });

    return this;
  }

  _orderBy(
    field: string = TaskDateFilterField.CREATED_AT,
    order: OrderType = 'DESC',
  ) {
    return this.addOrderBy(`Tasks.${field}`, order);
  }

  filterByStatus(status: TaskStatusCode) {
    return this.andWhere('Tasks.status = :status', {
      status,
    });
  }

  filterByType(type: TaskTypeCode) {
    return this.andWhere('"Tasks"."type" = :type', {
      type,
    });
  }

  filterByQuery(query: string) {
    return this.andWhere(
      '(Tasks.code ILIKE :query OR project.poId ILIKE :query OR project.name ILIKE :query)',
      {
        query: `%${query}%`,
      },
    );
  }

  filterByExcludingTaskIds(excludedTaskIds: string[]) {
    if (!excludedTaskIds.length) return this;
    return this.andWhere('Tasks.id NOT IN (:...excludedTaskIds)', {
      excludedTaskIds,
    });
  }

  joinProject() {
    return this.leftJoinAndSelect('Tasks.project', 'project');
  }

  joinClient() {
    return this.leftJoinAndSelect('project.client', 'client');
  }

  joinServiceProvider() {
    return this.leftJoinAndSelect('Tasks.serviceProvider', 'serviceProvider');
  }

  joinRate() {
    return this.leftJoinAndSelect('Tasks.rate', 'rate');
  }
}
