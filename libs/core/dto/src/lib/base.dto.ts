import { Currency, PAGINATION } from '@TaskM/core/constants';
import { CastHelper } from '@TaskM/core/helpers';
import { OrderType } from '@TaskM/core/types';
import { Expose, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class BaseDto {
  @Expose()
  id: string;

  @Expose()
  createdAt?: string;

  @Expose()
  updatedAt?: string;

  @Expose()
  deletedAt?: string;
}

export class BaseFilterDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  query?: string | null;

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

export class ClientOwnedDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  clientCode?: string;
}

export class ClientOwnedFilterDto extends BaseFilterDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  clientCode?: string | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsUUID()
  clientId?: string | null;
}

export class BaseClientDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  currency: Currency;
}
