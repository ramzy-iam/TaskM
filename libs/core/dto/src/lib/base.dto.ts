import { PAGINATION } from '@TaskM/core/constants';
import { CastHelper } from '@TaskM/core/helpers';
import { OrderType } from '@TaskM/core/types';
import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class BaseDto {
  @Expose()
  id: string;

  @Expose()
  createdAt?: string;

  @Expose()
  updatedAt?: string;
}

export class BaseFilterDto {
  @IsOptional()
  @IsString()
  query?: string;

  @Transform(({ value }) =>
    CastHelper.toNumber(value, {
      default: PAGINATION.DEFAULT_PAGE,
    }),
  )
  @IsOptional()
  @IsPositive()
  @Min(PAGINATION.DEFAULT_PAGE)
  page?: number;

  @Transform(({ value }) =>
    CastHelper.toNumber(value, {
      default: PAGINATION.DEFAULT_LIMIT,
    }),
  )
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(PAGINATION.MAX_LIMIT)
  limit?: number;

  @Transform(({ value }) => CastHelper.toOrder(value))
  @IsOptional()
  order?: OrderType;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  orderField?: string;

  @Transform(({ value }) => CastHelper.toBoolean(value))
  @IsOptional()
  withDeleted?: boolean;
}
