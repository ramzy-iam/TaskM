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

  getOne(id: string) {
    return this.clientsRepository.scoped.filterById(id).getOneOrFail();
  }

  async update(id: string, clientDto: UpdateClientDto) {
    await this.clientsRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(clientDto),
    );
    return this.getOne(id);
  }

  private async validateBeforeCreateOrUpdate(code?: string, clientId?: string) {
    if (!code) return;
    const existingClient = await this.clientsRepository.scoped
      .filterByCode({ code })
      .getOne();

    if (existingClient && (!clientId || existingClient.id !== clientId))
      throw new ConflictException(
        `There is already a client with the code '${code}'`,
      );
  }

  findAll<P = Client[]>(filters?: ClientsFilterDto) {
    const query = this.clientsRepository.scoped;
    if (filters?.query)
      query
        .filterByName({ name: filters?.query, operatorCode: 'OR' })
        .filterByCode({ code: filters?.query, operatorCode: 'OR' });

    return (
      filters?.page && filters?.limit
        ? paginateResult(query, {
            page: filters.page,
            limit: filters.limit,
          })
        : query.getMany()
    ) as Promise<P>;
  }

  findOne({ code, clientId }: ClientsFilterDto) {
    const query = this.clientsRepository.scoped;
    if (clientId) query.filterById(clientId);
    if (code) query.filterByCode({ code, strictOnCode: true });

    return query.getOne();
  }
}
