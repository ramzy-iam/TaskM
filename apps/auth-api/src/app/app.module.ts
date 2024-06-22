import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@TaskM/core/db';
import { AuthApiModule } from '@TaskM/auth/api';

@Module({
  imports: [DatabaseModule, AuthApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
