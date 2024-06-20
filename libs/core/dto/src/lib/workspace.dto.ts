import { Expose, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { WorkspaceUserDto } from './workspace-user.dto';

export class CreateWorkspaceDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  name: string;
}
export class UpdateWorkspaceDto {
  @Transform(({ value }) => value.trim())
  @MaxLength(20)
  @MinLength(4)
  @IsOptional()
  name: string;
}

export class WorkspaceDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  createdAt?: string;

  @Expose()
  @Type(() => WorkspaceUserDto)
  workspaceUsers?: WorkspaceUserDto[];
}
