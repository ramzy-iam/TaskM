import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { BaseDto, BaseFilterDto } from './base.dto';
import { PaymentMethod, PaymentMethodCode } from '@TaskM/core/constants';
import { CastHelper } from '@TaskM/core/helpers';

export class CreateLinguistDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsEnum(PaymentMethodCode)
  accountType: PaymentMethodCode;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsString()
  accountNumber: string;
}
export class UpdateLinguistDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  phone?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEnum(PaymentMethodCode)
  accountType?: PaymentMethodCode;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  accountName?: string;

  @Transform(({ value }) => CastHelper.trim(value))
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  accountNumber?: string;
}

export class LinguistsFilterDto extends BaseFilterDto {
  @Transform(({ value }) => CastHelper.trim(value))
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class LinguistPreviewDto extends BaseDto {
  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  fullName: string;

  @Expose()
  phone: string;
}

export class LinguistDto extends LinguistPreviewDto {
  @Expose()
  accountType: PaymentMethodCode;

  @Expose()
  @Transform(
    ({ obj }: { obj: { accountType: PaymentMethodCode } }) =>
      PaymentMethod[obj.accountType],
  )
  accountTypeLabel?: PaymentMethod;

  @Expose()
  accountName: string;

  @Expose()
  accountNumber: string;
}
