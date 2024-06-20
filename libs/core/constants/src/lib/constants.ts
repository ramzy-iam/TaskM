import { UserRole } from '@task-manager/users/types';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE_INFINITY = 10 ** 6;

export const ACCOUNT_VERIFICATION_EXPIRY_TIME = 10; //minutes

export const RESET_PASSWORD_EXPIRY_TIME = 10; //minutes

export const JWT_EXPIRY_DATE = '30d';

export const ROLES = {
  [UserRole.ADMIN]: 1,
  [UserRole.LINGUIST]: 2,
};

export const INVITATION_TOKEN_EXPIRY_TIME = 3; //days
