import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { User } from './user.entity';
import { WorkspaceUser } from './workspace-user.entity';

@Entity({ name: 'Workspaces' })
@Unique(['name', 'userId'])
export class Workspace extends AppBaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.workspaces)
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => WorkspaceUser, (workspaceUser) => workspaceUser.workspace, {
    cascade: true,
  })
  workspaceUsers: WorkspaceUser[];

  buildWorkspaceUserToSaveWithWorkspace(userId: number, roleIds?: number[]) {
    this.workspaceUsers = [new WorkspaceUser(userId, roleIds)];
  }
}
