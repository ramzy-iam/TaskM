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
  IsUUID,
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
import { MarkOptionalFields, TrackProperty } from '@TaskM/core/decorators';

export class CreateProjectDto {
  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  name: string;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsString()
  clientPM: string;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(TaskType)
  taskType: TaskType;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(Language)
  lang: Language;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  poId: string;

  @TrackProperty
  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  count: number;

  @TrackProperty
  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  rate: number;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(LoadUnit)
  unit: LoadUnit;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsPositive()
  clientId: string;

  @TrackProperty
  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  deadline: Date;

  @TrackProperty
  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  internalDeadline: Date;

  @TrackProperty
  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  receivedAt: Date;
}
@MarkOptionalFields()
export class UpdateProjectDto extends CreateProjectDto {}

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

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsUUID()
  clientId?: string;
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
  clientId: string;

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
