import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Workspace } from './workspace.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity({ name: 'WorkspaceUsers' })
export class WorkspaceUser extends AppBaseEntity {
  @Column()
  workspaceId: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.id, {
    nullable: false,
  })
  workspace: Workspace;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;

  @ManyToMany(() => Role, (role) => role.workspaceUsers, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  roles: Role[];
}
