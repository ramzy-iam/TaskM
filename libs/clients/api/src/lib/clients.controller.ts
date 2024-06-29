import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import {
  CreateClientDto,
  ClientDto,
  UpdateClientDto,
  ClientsFilterDto,
  PaginationDto,
  ClientPreviewDto,
} from '@TaskM/core/dto';
import { Serialize } from '@TaskM/core/interceptors';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Serialize(ClientDto)
  @Post()
  create(@Body() clientDto: CreateClientDto) {
    return this.clientsService.create(clientDto);
  }

  @Serialize(ClientDto)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.getOne(id);
  }

  @Serialize(ClientDto)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() clientDto: UpdateClientDto
  ) {
    return this.clientsService.update(id, clientDto);
  }

  @Serialize(new PaginationDto<ClientPreviewDto>(ClientPreviewDto))
  @Get()
  findAll(@Query() filters: ClientsFilterDto) {
    return this.clientsService.findAll(filters);
  }
}
