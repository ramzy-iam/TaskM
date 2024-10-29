import { Expose, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsPositive,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { BaseDto, BaseFilterDto } from './base.dto';
import { Currency, LoadUnit, TaskTypeCode } from '@TaskM/core/constants';
import { CastHelper } from '@TaskM/core/helpers';

export class CompetenceBaseDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsNotEmpty()
  serviceProviderId: string;
}

export class CreateCompetenceDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsEnum(TaskTypeCode)
  code: TaskTypeCode;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsEnum(LoadUnit)
  unit: LoadUnit;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(Currency)
  currency: Currency;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  rate: number;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  serviceProviderId: string;
}

export class UpdateCompetenceDto {
  @IsOptional()
  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsEnum(TaskTypeCode)
  code?: TaskTypeCode;

  @IsOptional()
  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsEnum(LoadUnit)
  unit?: LoadUnit;

  @IsOptional()
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  rate?: number;

  @IsOptional()
  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  serviceProviderId?: string;
}

export class CompetencesFilterDto extends BaseFilterDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsUUID()
  serviceProviderId?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(TaskTypeCode)
  code?: TaskTypeCode;

  @Transform(({ value }) => CastHelper.toBoolean(value))
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CompetencePreviewDto extends BaseDto {
  @Expose()
  code: TaskTypeCode;

  @Expose()
  rate: number;

  @Expose()
  currency: Currency;

  @Expose()
  unit: LoadUnit;

  @Expose()
  serviceProviderId: string;
}

export class CompetenceDto extends CompetencePreviewDto {}
