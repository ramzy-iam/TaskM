import { UserRole } from '@task-manager/users/types';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE_INFINITY = 10 ** 6;

export const OTP_EXPIRY_TIME = 10; //minutes
export const OTP_LENGTH = 6; //digit

export const RESET_PASSWORD_EXPIRY_TIME = 10; //minutes

export const JWT_EXPIRY_DATE = '30m';

export const ROLES = {
  [UserRole.ADMIN]: 1,
  [UserRole.LINGUIST]: 2,
};
