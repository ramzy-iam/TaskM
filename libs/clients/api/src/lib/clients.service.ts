import { ConflictException, Injectable } from '@nestjs/common';
import { Client, ClientsRepository } from '@TaskM/core/db';
import {
  ClientsFilterDto,
  CreateClientDto,
  UpdateClientDto,
} from '@TaskM/core/dto';
import { paginateResult, UtilsHelper } from '@TaskM/core/helpers';

@Injectable()
export class ClientsService {
  constructor(private clientsRepository: ClientsRepository) {}

  async create(clientDto: CreateClientDto) {
    await this.validateBeforeCreateOrUpdate(clientDto.code);

    const client = this.clientsRepository.create(clientDto);

    return this.clientsRepository.save(client);
  }

  getOne(id: number) {
    return this.clientsRepository.scoped.filterById(id).getOneOrFail();
  }

  async update(id: number, clientDto: UpdateClientDto) {
    await this.validateBeforeCreateOrUpdate(clientDto.code, id);

    await this.clientsRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(clientDto)
    );
    return this.getOne(id);
  }

  private async validateBeforeCreateOrUpdate(code?: string, clientId?: number) {
    if (!code) return;
    const existingClient = await this.clientsRepository.scoped
      .filterByCode(code)
      .getOne();

    if (existingClient && (!clientId || existingClient.id !== clientId))
      throw new ConflictException(
        `There is already a client with the code '${code}'`
      );
  }

  findAll(filters?: ClientsFilterDto) {
    const query = this.clientsRepository.scoped;
    if (filters?.query) query.filterByName(filters?.query);

    return filters?.page && filters?.limit
      ? paginateResult(query, { page: filters?.page, limit: filters.limit })
      : query.getMany();
  }
}
