import { Entity, Column, OneToMany } from 'typeorm';

import { AppBaseEntity } from './base.entity';
import { Workspace } from './workspace.entity';

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
  otp: string;

  @Column({ nullable: true, type: 'timestamptz' })
  otpExpiryTime: Date;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true, type: 'timestamptz' })
  passwordResetExpires: Date;

  @Column({ nullable: true, default: false })
  isVerified: boolean;

  @OneToMany(() => Workspace, (workspace) => workspace.user)
  workspaces: Workspace[];
}
