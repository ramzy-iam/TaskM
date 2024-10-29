import { Module } from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competence, ServiceProvider, ServiceProvidersRepository } from '@TaskM/core/db';
import { ServiceProvidersController } from './service-providers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvider, Competence])],
  controllers: [ServiceProvidersController],
  providers: [ServiceProvidersService, ServiceProvidersRepository],
})
export class ServiceProvidersApiModule {}
