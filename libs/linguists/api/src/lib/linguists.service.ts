import { Linguist, LinguistsRepository } from '@TaskM/core/db';
import {
  CreateLinguistDto,
  LinguistsFilterDto,
  UpdateLinguistDto,
} from '@TaskM/core/dto';
import { UtilsHelper } from '@TaskM/core/helpers';
import { paginateResult } from '@TaskM/core/helpers/backend';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class LinguistsService {
  constructor(private readonly linguistsRepository: LinguistsRepository) {}

  async create(linguistDto: CreateLinguistDto) {
    const { email } = linguistDto;
    await this.validateBeforeCreateOrUpdate(email);
    const linguist = this.linguistsRepository.create(linguistDto);
    return this.linguistsRepository.save(linguist);
  }

  getOne(id: string) {
    return this.linguistsRepository.scoped
      .filterById(id)
      .joinCompetences()
      .getOneOrFail();
  }

  async update(id: string, linguistDto: UpdateLinguistDto) {
    await this.validateBeforeCreateOrUpdate(linguistDto.email, id);

    await this.linguistsRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(linguistDto),
    );
    return this.getOne(id);
  }

  private async validateBeforeCreateOrUpdate(
    email?: string,
    linguistId?: string,
  ) {
    if (!email) return;
    const existingClient = await this.linguistsRepository.scoped
      .filterByEmail(email)
      .getOne();

    if (existingClient && (!linguistId || existingClient.id !== linguistId))
      throw new ConflictException(
        `There is already a linguist with the email '${email}'`,
      );
  }

  findAll<P = Linguist[]>(filters?: LinguistsFilterDto) {
    const query = this.linguistsRepository.scoped;
    if (filters?.query) query.filterByName(filters.query);
    if (filters?.withDeleted) query.withDeleted();
    if (filters?.email) query.filterByEmail(filters.email);

    query.joinCompetences()._orderBy();

    return (
      filters?.page && filters?.limit
        ? paginateResult(query, { page: filters?.page, limit: filters.limit })
        : query.getMany()
    ) as Promise<P>;
  }

  findOne(filters?: LinguistsFilterDto) {
    const query = this.linguistsRepository.scoped;
    if (filters?.id) query.filterById(filters.id);
    if (filters?.email) query.filterByEmail(filters.email);

    return query.joinCompetences().getOne();
  }
}
