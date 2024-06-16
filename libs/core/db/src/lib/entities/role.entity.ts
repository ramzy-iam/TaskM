import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  Unique,
} from 'typeorm';
import { WorkspaceUser } from './workspace-user.entity';
import { UserRole } from '@task-manager/users/types';

@Entity({ name: 'Roles' })
@Unique(['name'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.LINGUIST,
    nullable: true,
  })
  name: UserRole;

  @ManyToMany(() => WorkspaceUser, (workspaceUser) => workspaceUser.roles)
  workspaceUsers: WorkspaceUser[];
}
