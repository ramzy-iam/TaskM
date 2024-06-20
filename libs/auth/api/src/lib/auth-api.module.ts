import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '@task-manager/users/api';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  UsersRepository,
  WorkspaceUser,
  WorkspaceUsersRepository,
} from '@task-manager/core/db';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constant';
import { WorkspaceUsersService } from '@task-manager/workspace-users/api';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, WorkspaceUser]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2m' },
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AuthService,
    UsersService,
    UsersRepository,
    WorkspaceUsersService,
    WorkspaceUsersRepository,
  ],
  controllers: [AuthController],
})
export class AuthApiModule {}
