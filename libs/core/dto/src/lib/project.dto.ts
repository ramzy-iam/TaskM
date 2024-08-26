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
import { BaseClientDto, BaseDto, ClientOwnedFilterDto } from './base.dto';
import {
  LANGUAGE_LABELS,
  Language,
  LoadUnit,
  ProjectDateFilterField,
  ProjectStatus,
  ProjectStatusCode,
  TASK_LABELS,
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
  @IsEnum(ProjectStatusCode)
  status: ProjectStatusCode;

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

  @IsOptional()
  @IsEnum(ProjectStatusCode)
  status?: ProjectStatusCode | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(TaskType)
  task?: TaskType | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  poId?: string | null;
}

export class ProjectPreviewDto extends BaseDto {
  @Expose()
  name: string;

  @Expose()
  status: ProjectStatusCode;

  @Expose()
  @Transform(
    ({ obj }: { obj: { status: ProjectStatusCode } }) =>
      ProjectStatus[obj.status],
  )
  statusLabel?: string;

  @Expose()
  taskType: TaskType;

  @Expose()
  @Transform(
    ({ obj }: { obj: { taskType: TaskType } }) => TASK_LABELS[obj.taskType],
  )
  taskLabel?: string;

  @Expose()
  lang: Language;

  @Expose()
  @Transform(
    ({ obj }: { obj: { lang: Language } }) => LANGUAGE_LABELS[obj.lang],
  )
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
