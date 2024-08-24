import { Expose, Transform, Type } from 'class-transformer';
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
  ValidateNested,
} from 'class-validator';
import {
  BaseClientDto,
  BaseDto,
  BaseFilterDto,
  ClientOwnedFilterDto,
} from './base.dto';
import {
  LANGUAGES_WITH_LABEL,
  LANGUAGE_LABELS,
  Language,
  LoadUnit,
  ProjectDateFilterField,
  ProjectStatus,
  TASK_LABELS,
  TASK_TYPES_WITH_LABEL,
  TaskType,
} from '@TaskM/core/constants';
import { CastHelper } from '@TaskM/core/helpers';
import { ClientBaseDto } from './client.dto';

export class CreateProjectDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
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
  clientPoId: string;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  count: number;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  rate: number;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(LoadUnit)
  unit: LoadUnit;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  deadline: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  internalDeadline: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  receivedAt: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => ClientBaseDto)
  client?: ClientBaseDto;
}
export class UpdateProjectDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(4)
  @IsOptional()
  name?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsString()
  @IsOptional()
  clientPM?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(TaskType)
  @IsOptional()
  taskType?: TaskType;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(Language)
  @IsOptional()
  lang?: Language;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  clientPoId?: string;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  @IsOptional()
  count?: number;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  @IsOptional()
  rate?: number;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(LoadUnit)
  @IsOptional()
  unit?: LoadUnit;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  deadline?: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  @IsOptional()
  internalDeadline?: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsDate()
  @IsOptional()
  receivedAt?: Date;
}

export class ProjectsFilterDto extends ClientOwnedFilterDto {
  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  from?: Date | null;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  to?: Date | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(ProjectDateFilterField)
  dateField?: ProjectDateFilterField | null;

  @Transform(({ value }) =>
    value
      ? (ProjectStatus[CastHelper.trim(value) as keyof typeof ProjectStatus] ??
        value)
      : null,
  )
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus | null;

  @Transform(({ value }) =>
    value
      ? (TaskType[CastHelper.trim(value) as keyof typeof TaskType] ?? value)
      : null,
  )
  @IsOptional()
  @IsEnum(TaskType)
  taskType?: TaskType | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  poId?: string | null;
}

export class ProjectPreviewDto extends BaseDto {
  @Expose()
  name: string;

  @Expose()
  status: ProjectStatus;

  @Expose()
  taskType: TaskType;

  @Expose()
  @Transform(({ obj }) => TASK_LABELS[obj.taskType]?.name)
  taskLabel?: string;

  @Expose()
  lang: Language;

  @Expose()
  @Transform(({ obj }) => LANGUAGE_LABELS[obj.lang]?.name)
  langLabel?: string;

  @Expose()
  poId: string;

  @Expose()
  clientPoId: string;

  @Expose()
  clientId: string;

  @Expose()
  internalDeadline: Date;

  @Type(() => BaseClientDto)
  @Expose()
  client: BaseClientDto;
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
  deadline: Date;

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
