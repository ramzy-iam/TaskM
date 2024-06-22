import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';

import { AppBaseEntity } from './base.entity';
import { Workspace } from './workspace.entity';
import { StateUser } from '@TaskM/users/types';
import { WorkspaceUser } from './workspace-user.entity';

@Entity({ name: 'Users' })
export class User extends AppBaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true, type: 'timestamptz' })
  tokenExpires: Date;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true, type: 'timestamptz' })
  passwordResetExpires: Date;

  @Column({
    type: 'enum',
    enum: StateUser,
    default: StateUser.UNCONFIRMED,
  })
  state: StateUser;

  @Column({ nullable: true })
  activeWorkspaceId: number;

  @OneToMany(() => Workspace, (workspace) => workspace.id, { nullable: true })
  @JoinColumn({ name: 'activeWorkspaceId' })
  activeWorkspace?: Workspace;

  @OneToMany(() => WorkspaceUser, (workspaceUser) => workspaceUser.user, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  workspaceUsers: WorkspaceUser[];
}
