import { Expose, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsPositive,
  IsDate,
  IsUUID,
  IsArray,
} from 'class-validator';
import {
  BaseClientDto,
  BaseDto,
  BaseServiceProviderDto,
  BaseProjectDto,
  ClientOwnedFilterDto,
} from './base.dto';
import {
  Language,
  LanguageCode,
  LoadUnit,
  TaskDateFilterField,
  TaskStatus,
  TaskStatusCode,
  TaskType,
  TaskTypeCode,
} from '@TaskM/core/constants';
import { CastHelper } from '@TaskM/core/helpers';
import { CompetenceDto } from './competence.dto';

export class CreateTaskDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(TaskStatusCode)
  status?: TaskStatusCode;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(TaskTypeCode)
  type: TaskTypeCode;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(LanguageCode)
  lang: LanguageCode;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  count: number;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(LoadUnit)
  unit: LoadUnit;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  assignedAt: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsNotEmpty()
  @IsDate()
  deadline: Date;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsNotEmpty()
  rateId: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsNotEmpty()
  serviceProviderId: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsNotEmpty()
  projectId: string;
}
export class UpdateTaskDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(TaskStatusCode)
  status?: TaskStatusCode;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(TaskTypeCode)
  type?: TaskTypeCode;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(LanguageCode)
  lang?: LanguageCode;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsOptional()
  @IsPositive()
  count?: number;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(LoadUnit)
  unit?: LoadUnit;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  assignedAt?: Date;

  @Transform(({ value }) => CastHelper.toDate(value))
  @IsOptional()
  @IsDate()
  deadline?: Date;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsOptional()
  rateId?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsOptional()
  serviceProviderId?: string;
}

export class TasksFilterDto extends ClientOwnedFilterDto {
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
  @IsEnum(TaskDateFilterField)
  dateField?: TaskDateFilterField | null;

  @IsOptional()
  @IsEnum(TaskStatusCode)
  status?: TaskStatusCode | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(TaskTypeCode)
  task?: TaskTypeCode | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  code?: string | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsOptional()
  serviceProviderId?: string | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsOptional()
  projectCode?: string | null;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsOptional()
  projectId?: string | null;
}

export class TaskPreviewDto extends BaseDto {
  @Expose()
  code: string;

  @Expose()
  status: TaskStatusCode;

  @Expose()
  count: number;

  @Expose()
  unit: LoadUnit;

  @Expose()
  @Transform(
    ({ obj }: { obj: { status: TaskStatusCode } }) => TaskStatus[obj.status],
  )
  statusLabel?: TaskStatus;

  @Expose()
  type: TaskTypeCode;

  @Expose()
  @Transform(({ obj }: { obj: { type: TaskTypeCode } }) => TaskType[obj.type])
  typeLabel?: string;

  @Expose()
  lang: LanguageCode;

  @Expose()
  @Transform(({ obj }: { obj: { lang: LanguageCode } }) => Language[obj.lang])
  langLabel?: string;

  @Type(() => BaseProjectDto)
  @Expose()
  project: BaseProjectDto;

  @Type(() => BaseServiceProviderDto)
  @Expose()
  serviceProvider: BaseServiceProviderDto;
}

export class TaskDto extends TaskPreviewDto {
  @Type(() => CompetenceDto)
  @Expose()
  rate: CompetenceDto;

  @Expose()
  deadline: Date;

  @Expose()
  assignedAt: Date;
}

export class TaskRemainingLoadDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsEnum(TaskTypeCode)
  task: TaskTypeCode;

  @Transform(({ value }) => CastHelper.toArray(value))
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  excludedTaskIds?: string[];
}
