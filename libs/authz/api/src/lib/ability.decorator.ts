import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PermissionAction, PermissionSubject } from '@TaskM/core/types';

export type RequiredPermission = [PermissionAction, PermissionSubject];
export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';
export const CheckPermissions = (
  ...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, params);
