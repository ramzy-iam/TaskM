import { PaginationMeta } from '@TaskM/core/types';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export async function paginateResult<T extends ObjectLiteral, P = undefined>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
  isRawQuery = false,
  queryBuilderForExtraFields?: SelectQueryBuilder<T>
): Promise<Pagination<T, PaginationMeta<P>>> {
  const limit = +options.limit,
    page = +options.page;

  const countQueryBuilder = queryBuilder.clone();
  const itemsQuery = queryBuilder.take(limit).skip((page - 1) * limit);
  const items = await (isRawQuery
    ? itemsQuery.getRawMany()
    : itemsQuery.getMany());
  const totalItems = await countQueryBuilder.getCount();
  const extra = await queryBuilderForExtraFields?.getRawOne<P>();
  return {
    items,
    meta: {
      extra,
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
  };
}
