import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { User } from './user.entity';
import { WorkspaceUser } from './workspace-user.entity';

@Entity({ name: 'Workspaces' })
export class Workspace extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @ManyToOne(() => User, (user) => user.workspaces)
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => WorkspaceUser, (workspaceUser) => workspaceUser.workspace, {
    cascade: true,
  })
  workspaceUsers: WorkspaceUser[];
}
