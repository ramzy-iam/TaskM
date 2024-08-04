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
  ValidationArguments,
  Matches,
} from 'class-validator';
import { BaseDto, BaseFilterDto } from './base.dto';
import { Currency, PaymentMethod } from '@TaskM/core/constants';
import { CastHelper } from '@TaskM/core/helpers';
import { MarkOptionalFields, TrackProperty } from '@TaskM/core/decorators';

export class CreateClientDto {
  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @MaxLength(20)
  @MinLength(4)
  @IsString()
  @IsNotEmpty()
  name: string;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsUppercase()
  @MaxLength(10)
  @MinLength(2)
  @Matches(/^\S*$/, {
    message: (args: ValidationArguments) =>
      `${args.property} should not contain any spaces`,
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @TrackProperty
  @Transform(({ value }) => CastHelper.toNumber(value))
  @IsPositive()
  paymentDueDays: number;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEmail()
  @IsNotEmpty()
  billingEmailAddress: string;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsString()
  billingPeriod: string;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(Currency)
  currency: Currency;

  @TrackProperty
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

@MarkOptionalFields()
export class UpdateClientDto extends CreateClientDto {}

export class ClientsFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsUppercase()
  @MaxLength(10)
  @MinLength(2)
  @Matches(/^\S*$/, {
    message: (args: ValidationArguments) =>
      `${args.property} should not contain any spaces`,
  })
  @IsNotEmpty()
  @IsString()
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

  @Expose()
  billingEmailAddress: string;

  @Expose()
  currency: Currency;
}
export class ClientDto extends ClientPreviewDto {
  @Expose()
  paymentDueDays: number;

  @Expose()
  billingPeriod: string;

  @Expose()
  paymentMethod: PaymentMethod;
}
