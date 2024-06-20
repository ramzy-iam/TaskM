export interface BaseFilter {
  id?: number;
  email?: string;
  name?: string;
  token?: string;
}

export interface UserListFilter extends BaseFilter {
  userIds?: string[];
}

export type UserFilter = BaseFilter;
