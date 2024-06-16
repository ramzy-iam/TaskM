export interface BaseFilter {
  id?: number;
  email?: string;
  name?: string;
  isVerified?: boolean;
}

export interface UserListFilter extends BaseFilter {
  userIds?: string[];
}

export type UserFilter = BaseFilter;
