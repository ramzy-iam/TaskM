import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CaslSubject } from './casl-subject.entity';
import { RolePermission } from './role-permission.entity';
import { PermissionAction } from '@TaskM/core/types';

@Entity({ name: 'Permissions' })
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subjectId: number;

  @ManyToOne(() => CaslSubject, (subject) => subject.id, { nullable: false })
  @JoinColumn({ name: 'subjectId' })
  permissionSubject: CaslSubject;

  @Column({
    type: 'enum',
    enum: PermissionAction,
  })
  action: PermissionAction;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
    {
      cascade: true,
    }
  )
  rolePermissions: RolePermission[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  conditions: object;

  public static parseCondition(
    condition: object,
    variables: { [key: string]: any }
  ) {
    if (!condition) return null;
    const parsedCondition: { [key: string]: any } = {};

    for (const [key, rawValue] of Object.entries(condition)) {
      if (rawValue !== null && typeof rawValue === 'object') {
        if (key.includes('$')) {
          parsedCondition[key] = rawValue;
          continue;
        } else {
          const value = this.parseCondition(rawValue, variables);
          parsedCondition[key] = value;
          continue;
        }
      }
      if (typeof rawValue !== 'string') {
        parsedCondition[key] = rawValue;
        continue;
      }

      const matches = /{([a-zA-Z0-9]+)}$/.exec(rawValue);
      if (!matches) {
        parsedCondition[key] = rawValue;
        continue;
      }

      const value = variables[matches[1]];
      if (typeof value === 'undefined') {
        throw new ReferenceError(`Variable ${value} is not defined`);
      }
      parsedCondition[key] = value;
    }
    return parsedCondition;
  }
}
