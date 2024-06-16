import { IPaginationMeta } from 'nestjs-typeorm-paginate';
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type SortOrderType = 'ASC' | 'DESC';

export type PaginationMeta<T = undefined> = IPaginationMeta & {
  extra?: T;
};
