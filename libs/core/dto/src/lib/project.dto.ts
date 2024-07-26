import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEmail,
  IsEnum,
  IsPositive,
  IsUppercase,
  IsDate,
} from 'class-validator';
import { BaseDto, BaseFilterDto } from './base.dto';
import {
  Currency,
  Language,
  LoadUnit,
  PaymentMethod,
  ProjectDateFilterField,
  ProjectStatus,
  TaskType,
} from '@TaskM/core/constants';
import { CastHelper } from '@TaskM/core/helpers';

export class CreateProjectDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  name: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsString()
  clientPM: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(TaskType)
  taskType: TaskType;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(Language)
  lang: Language;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  poId: string;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  count: number;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  rate: number;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(LoadUnit)
  unit: LoadUnit;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  clientId: number;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  deadline: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  internalDeadline: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  receivedAt: Date;
}

export class UpdateProjectDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  @IsOptional()
  name?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsString()
  clientPM: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(TaskType)
  taskType: TaskType;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(Language)
  lang: Language;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsString()
  poId: string;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsOptional()
  @IsPositive()
  count: number;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsOptional()
  @IsPositive()
  rate: number;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(LoadUnit)
  unit: LoadUnit;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsOptional()
  @IsPositive()
  clientId: number;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  deadline: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  internalDeadline: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  receivedAt: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  deliveredAt: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  invoicedAt: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  expectedPaidAt: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  paidAt: Date;
}

export class ProjectsFilterDto extends BaseFilterDto {
  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  from?: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  to?: Date;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(ProjectDateFilterField)
  dateField?: ProjectDateFilterField;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(TaskType)
  taskType?: TaskType;
}

export class ProjectPreviewDto extends BaseDto {
  @Expose()
  name: string;

  @Expose()
  status: ProjectStatus;

  @Expose()
  taskType: TaskType;

  @Expose()
  lang: Language;

  @Expose()
  poId: string;

  @Expose()
  clientId: number;

  @Expose()
  deadline: Date;
}

export class ProjectDto extends ProjectPreviewDto {
  @Expose()
  count: number;

  @Expose()
  rate: number;

  @Expose()
  unit: LoadUnit;

  @Expose()
  clientPM: string;

  @Expose()
  internalDeadline: Date;

  @Expose()
  receivedAt: Date;

  @Expose()
  deliveredAt: Date;

  @Expose()
  invoicedAt: Date;

  @Expose()
  expectedPaidAt: Date;

  @Expose()
  paidAt: Date;
}
