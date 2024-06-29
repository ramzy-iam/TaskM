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
  IsNumber,
  IsUppercase,
} from 'class-validator';
import { BasicDto, BasicFilterDto } from './basic.dto';
import { CurrencyEnum, PaymentMethodEnum } from '@TaskM/core/constants';
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
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;
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
}

export class ClientsFilterDto extends BasicFilterDto {}

export class ClientPreviewDto extends BasicDto {
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
  currency: CurrencyEnum;

  @Expose()
  paymentMethod: PaymentMethodEnum;
}
