import { StateUser } from '@task-manager/users/types';
import { Expose, Type } from 'class-transformer';
import { RoleDto } from './role.dto';

export class WorkspaceUserDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  createdAt: string;

  @Expose()
  workspaceId: number;

  @Expose()
  state?: StateUser;

  @Expose()
  @Type(() => RoleDto)
  roles: RoleDto[];
}
