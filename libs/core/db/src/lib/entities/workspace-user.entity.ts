import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Workspace } from './workspace.entity';
import { User } from './user.entity';
import { Role } from './role.entity';
import { StateUser } from '@task-manager/users/types';

@Entity({ name: 'WorkspaceUsers' })
export class WorkspaceUser extends AppBaseEntity {
  @Column()
  workspaceId: number;

  @Column({ nullable: true })
  tokenInvitation?: string;

  @Column({ nullable: true, type: 'timestamptz' })
  tokenInvitationExpires?: Date;

  @Column({
    type: 'enum',
    enum: StateUser,
    default: StateUser.CONFIRMED,
  })
  state: StateUser;

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
  roles?: Role[];

  buildRolesToSave(roleIds?: number[]) {
    this.roles = roleIds?.map((roleId) => new Role(roleId));
  }

  constructor(
    userId: number,
    roleIds?: number[],
    tokenInvitation?: string,
    tokenInvitationExpires?: Date
  ) {
    super();
    this.userId = userId;
    this.tokenInvitation = tokenInvitation;
    this.tokenInvitationExpires = tokenInvitationExpires;
    this.buildRolesToSave(roleIds);
  }
}
