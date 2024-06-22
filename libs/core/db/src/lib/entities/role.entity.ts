import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  Unique,
} from 'typeorm';
import { WorkspaceUser } from './workspace-user.entity';
import { UserRole } from '@TaskM/core/types';

@Entity({ name: 'Roles' })
@Unique(['name'])
export class Role {
  constructor(id: number) {
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DEFAULT,
    nullable: true,
  })
  name: UserRole;

  @ManyToMany(() => WorkspaceUser, (workspaceUser) => workspaceUser.roles)
  workspaceUsers: WorkspaceUser[];
}
