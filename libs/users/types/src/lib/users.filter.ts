export interface BaseFilter {
  email?: string;
  name?: string;
  isVerified?: boolean;
}

export interface UserListFilter extends BaseFilter {
  userIds?: string[];
}

export type UserFilter = BaseFilter;
