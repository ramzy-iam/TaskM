import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@TaskM/core/db';
import { ClientsApiModule } from '@TaskM/clients/api';

@Module({
  imports: [DatabaseModule, ClientsApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
