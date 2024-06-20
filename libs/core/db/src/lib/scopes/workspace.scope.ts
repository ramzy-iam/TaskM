import { SelectQueryBuilder } from 'typeorm';
import { Workspace } from '../entities';

export class WorkspacesScope extends SelectQueryBuilder<Workspace> {
  filterById(id: number): WorkspacesScope {
    return this.andWhere('Workspaces.id = :id', {
      id: id,
    });
  }

  filterByName(name: string): WorkspacesScope {
    return this.andWhere('Workspaces.name ILIKE :name', {
      name: `%${name}%`,
    });
  }
}
