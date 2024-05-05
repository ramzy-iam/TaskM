import { Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from './base.entity';

export class WorkspaceOwnedEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  @IsNotEmpty()
  workspaceId: number;
}
