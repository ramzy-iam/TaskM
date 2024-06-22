import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@TaskM/core/db';
import { UsersApiModule } from '@TaskM/users/api';
import {
  AuthApiModule,
  AuthGuard,
  AuthService,
  JwtStrategy,
} from '@TaskM/auth/api';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { WorkspacesApiModule } from '@TaskM/workspaces/api';
import { WorkspaceUsersApiModule } from '@TaskM/workspace-users/api';
import { AuthzApiModule } from '@TaskM/authz/api';

@Module({
  imports: [
    DatabaseModule,
    UsersApiModule,
    AuthApiModule,
    AuthzApiModule,
    WorkspacesApiModule,
    WorkspaceUsersApiModule,
  ],
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
