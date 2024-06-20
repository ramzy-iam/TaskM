import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsPositive,
  IsArray,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { WorkspaceDto } from './workspace.dto';

export class BaseUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto extends BaseUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  override email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  override password: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SendVerificationLinkDto extends ForgotPasswordDto {}

export class VerifyAccountDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ChangeActiveWorkspaceDto {
  @IsPositive()
  @IsNotEmpty()
  workspaceId: number;
}

export class ConfirmInvitationDto {
  @IsString()
  @IsNotEmpty()
  tokenInvitation: string;
}

export class InviteUserToWorkspaceDto {
  @IsArray()
  @IsString({ each: true })
  @IsEmail({}, { each: true })
  emails: string[];

  @IsPositive()
  @IsNotEmpty()
  roleId: number;
}

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  createdAt?: Date;
}

export class UserInfoDto {
  @Expose()
  user: UserDto;

  @Expose()
  @Type(() => WorkspaceDto)
  activeWorkspace: WorkspaceDto;

  @Expose()
  @Type(() => WorkspaceDto)
  workspaces: WorkspaceDto[];
}
