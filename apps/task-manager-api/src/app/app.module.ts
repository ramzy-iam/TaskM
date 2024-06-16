import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@task-manager/core/db';
import { UsersApiModule } from '@task-manager/users/api';
import {
  AuthApiModule,
  AuthGuard,
  AuthService,
  JwtStrategy,
} from '@task-manager/auth/api';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, UsersApiModule, AuthApiModule],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
