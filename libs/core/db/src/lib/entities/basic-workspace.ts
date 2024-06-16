import { Column } from 'typeorm';
import { AppBaseEntity } from './base.entity';

export class WorkspaceOwnedEntity extends AppBaseEntity {
  @Column({
    nullable: false,
  })
  workspaceId: number;
}
