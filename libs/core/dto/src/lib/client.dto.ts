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
  IsUUID,
} from 'class-validator';
import { BaseDto, BaseFilterDto } from './base.dto';
import { Currency, PaymentMethod } from '@TaskM/core/constants';
import { CastHelper } from '@TaskM/core/helpers';

export class CreateClientDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  name: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @MaxLength(10)
  @MinLength(2)
  code: string;

  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  paymentDueDays: number;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEmail()
  billingEmailAddress: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  billingPeriod: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(Currency)
  currency: Currency;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

export class UpdateClientDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  @IsOptional()
  name?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @MaxLength(10)
  @MinLength(2)
  @IsOptional()
  code?: string;

  @IsOptional()
  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  paymentDueDays?: number;

  @IsOptional()
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEmail()
  billingEmailAddress?: string;

  @IsOptional()
  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  billingPeriod?: string;

  @IsOptional()
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}

export class ClientsFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @MaxLength(10)
  @MinLength(2)
  code?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;
}

export class ClientPreviewDto extends BaseDto {
  @Expose()
  name: string;

  @Expose()
  code: string;
}
export class ClientDto extends ClientPreviewDto {
  @Expose()
  paymentDueDays: number;

  @Expose()
  billingEmailAddress: string;

  @Expose()
  billingPeriod: string;

  @Expose()
  currency: Currency;

  @Expose()
  paymentMethod: PaymentMethod;
}
