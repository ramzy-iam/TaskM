export enum PermissionAction {
  MANAGE = 'manage', // can perform all actions
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  FILTER = 'filter',
  SEARCH = 'search',
  CANCEL = 'cancel',
  APPROVE = 'approve',
  INVITE = 'invite',
  REMOVE = 'remove',
}

export enum UserRole {
  ADMIN = 'Admin',
  LINGUIST = 'Linguist',
  DEFAULT = 'Simple User',
}

export enum PermissionSubject {
  ALL = 'all',
  WORKSPACE = 'Workspace',
  WORKSPACE_USER = 'WorkspaceUser',
  USER = 'User',
}
