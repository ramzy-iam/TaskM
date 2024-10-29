import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import {
  CreateServiceProviderDto,
  ServiceProviderDto,
  UpdateServiceProviderDto,
  ServiceProvidersFilterDto,
  PaginationDto,
  ServiceProviderPreviewDto,
} from '@TaskM/core/dto';
import { Serialize } from '@TaskM/core/interceptors';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ServiceProvider } from '@TaskM/core/db';

@Controller('service-providers')
export class ServiceProvidersController {
  constructor(private serviceProvidersService: ServiceProvidersService) {}

  @Serialize(ServiceProviderDto)
  @Post()
  create(@Body() serviceProviderDto: CreateServiceProviderDto) {
    return this.serviceProvidersService.create(serviceProviderDto);
  }

  @Serialize(ServiceProviderDto)
  @Get('one')
  findOne(@Query() filters: ServiceProvidersFilterDto) {
    return this.serviceProvidersService.findOne(filters);
  }

  @Serialize(ServiceProviderDto)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.serviceProvidersService.getOne(id);
  }

  @Serialize(ServiceProviderDto)
  @Patch(':id')
  update(@Param('id') id: string, @Body() serviceProviderDto: UpdateServiceProviderDto) {
    return this.serviceProvidersService.update(id, serviceProviderDto);
  }

  @Serialize(new PaginationDto<ServiceProviderPreviewDto>(ServiceProviderPreviewDto))
  @Get()
  findAll(@Query() filters: ServiceProvidersFilterDto) {
    return this.serviceProvidersService.findAll<Pagination<ServiceProvider>>(filters);
  }
}
