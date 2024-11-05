import { SelectQueryBuilder } from 'typeorm';
import { Project, Task } from '../entities';
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

  filterByAtLeastNumberOfTasks(numberOfTasks = 1) {
    if (!numberOfTasks) return this;

    const subQuery = this.subQuery()
      .select('COUNT(*)')
      .from(Task, '_tasks')
      .where('_tasks.projectId = Projects.id'); // No need for extra parameters here

    return this.andWhere(`(${subQuery.getQuery()}) >= :numberOfTasks`, {
      numberOfTasks,
    });
  }

  joinClient() {
    return this.leftJoinAndSelect('Projects.client', 'client');
  }

  joinTasks() {
    return this.leftJoinAndSelect('Projects.tasks', 'tasks')
      .leftJoinAndSelect('tasks.serviceProvider', 'serviceProvider')
      .leftJoinAndSelect('tasks.rate', 'rate');
  }
}
