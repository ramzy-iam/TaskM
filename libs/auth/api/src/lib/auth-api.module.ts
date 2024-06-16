import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository, UsersService } from '@task-manager/users/api';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@task-manager/core/db';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2m' },
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, UsersService, UsersRepository],
  controllers: [AuthController],
})
export class AuthApiModule {}
