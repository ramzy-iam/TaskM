import { DataPermissionsToInitDB } from './permission.data.init-db';
import { DataRolesToInitDB } from './role.data.init-db';

export const DataRolePermissionsToInitDB = [
  {
    id: 1,
    roleId: DataRolesToInitDB[0].id,
    permissionId: DataPermissionsToInitDB[0].id,
  },
  {
    id: 2,
    roleId: DataRolesToInitDB[0].id,
    permissionId: DataPermissionsToInitDB[1].id,
  },
  {
    id: 3,
    roleId: DataRolesToInitDB[0].id,
    permissionId: DataPermissionsToInitDB[2].id,
  },
];
