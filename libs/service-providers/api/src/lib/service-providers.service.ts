import { ServiceProvider, ServiceProvidersRepository } from '@TaskM/core/db';
import {
  CreateServiceProviderDto,
  ServiceProvidersFilterDto,
  UpdateServiceProviderDto,
} from '@TaskM/core/dto';
import { UtilsHelper } from '@TaskM/core/helpers';
import { paginateResult } from '@TaskM/core/helpers/backend';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class ServiceProvidersService {
  constructor(
    private readonly serviceProvidersRepository: ServiceProvidersRepository,
  ) {}

  async create(serviceProviderDto: CreateServiceProviderDto) {
    const { email } = serviceProviderDto;
    await this.validateBeforeCreateOrUpdate(email);
    const serviceProvider =
      this.serviceProvidersRepository.create(serviceProviderDto);
    return this.serviceProvidersRepository.save(serviceProvider);
  }

  getOne(id: string) {
    return this.serviceProvidersRepository.scoped
      .filterById(id)
      .joinCompetences()
      .getOneOrFail();
  }

  async update(id: string, serviceProviderDto: UpdateServiceProviderDto) {
    await this.validateBeforeCreateOrUpdate(serviceProviderDto.email, id);

    await this.serviceProvidersRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(serviceProviderDto),
    );
    return this.getOne(id);
  }

  private async validateBeforeCreateOrUpdate(
    email?: string,
    serviceProviderId?: string,
  ) {
    if (!email) return;
    const existingClient = await this.serviceProvidersRepository.scoped
      .filterByEmail(email)
      .getOne();

    if (
      existingClient &&
      (!serviceProviderId || existingClient.id !== serviceProviderId)
    )
      throw new ConflictException(
        `There is already a serviceProvider with the email '${email}'`,
      );
  }

  findAll<P = ServiceProvider[]>(filters?: ServiceProvidersFilterDto) {
    const query = this.serviceProvidersRepository.scoped;
    if (filters?.query) query.filterByName(filters.query);
    if (filters?.withDeleted) query.withDeleted();
    if (filters?.email) query.filterByEmail(filters.email);
    if (filters?.competence) query.filterByCompetenceCode(filters.competence);

    query.joinCompetences().order();

    return (
      filters?.page && filters?.limit
        ? paginateResult(query, { page: filters?.page, limit: filters.limit })
        : query.getMany()
    ) as Promise<P>;
  }

  findOne(filters?: ServiceProvidersFilterDto) {
    const query = this.serviceProvidersRepository.scoped;
    if (filters?.id) query.filterById(filters.id);
    if (filters?.email) query.filterByEmail(filters.email);

    return query.joinCompetences().getOne();
  }
}
