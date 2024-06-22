import { PermissionAction } from '../../../types/src';
import { DataSubjectsToInitDB } from './casl-subjects.data.init-db';

export const DataPermissionsToInitDB = [
  //all resources
  {
    id: 1,
    subjectId: DataSubjectsToInitDB[0].id,
    action: PermissionAction.MANAGE,
  },

  //workspaceUser
  {
    id: 2,
    subjectId: DataSubjectsToInitDB[1].id,
    action: PermissionAction.INVITE,
  },
  {
    id: 3,
    subjectId: DataSubjectsToInitDB[1].id,
    action: PermissionAction.CANCEL,
  },

  //Workspace
  {
    id: 4,
    subjectId: DataSubjectsToInitDB[2].id,
    action: PermissionAction.UPDATE,
  },
  {
    id: 5,
    subjectId: DataSubjectsToInitDB[3].id,
    action: PermissionAction.DELETE,
  },
];
