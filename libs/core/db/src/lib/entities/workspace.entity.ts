import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { WorkspaceUser } from './workspace-user.entity';

@Entity({ name: 'Workspaces' })
@Unique(['name'])
export class Workspace extends AppBaseEntity {
  @Column()
  name: string;

  /**
   * Boolean to know if other users than admin can see all the details of a workspace
   */
  @Column({
    default: false,
  })
  isVisible: boolean;

  @OneToMany(() => WorkspaceUser, (workspaceUser) => workspaceUser.workspace, {
    cascade: true,
  })
  workspaceUsers: WorkspaceUser[];

  buildWorkspaceUserToSaveWithWorkspace(userId: number, roleIds?: number[]) {
    this.workspaceUsers = [new WorkspaceUser(userId, roleIds)];
  }
}
