import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Competence, CompetencesRepository } from '@TaskM/core/db';
import {
  CompetencesFilterDto,
  CreateCompetenceDto,
  UpdateCompetenceDto,
} from '@TaskM/core/dto';
import { paginateResult } from '@TaskM/core/helpers/backend';
import { omit } from 'radash';

@Injectable()
export class CompetencesService {
  constructor(private readonly competenceRepository: CompetencesRepository) {}

  async create(competenceDto: CreateCompetenceDto): Promise<Competence> {
    const { rate } = competenceDto;

    const existingCompetence = await this.competenceRepository.scoped
      .filterByServiceProviderId(competenceDto.serviceProviderId)
      .filterByCode(competenceDto.code)
      .filterByUnit(competenceDto.unit)
      .filterByCurrency(competenceDto.currency)
      .withDeleted()
      .getOne();

    if (
      existingCompetence &&
      existingCompetence.rate !== rate &&
      !existingCompetence.deletedAt
    ) {
      throw new ConflictException(
        'Competence already exists with a different rate',
      );
    }

    if (existingCompetence) {
      existingCompetence.active = true;
      existingCompetence.deletedAt = null;
      await this.competenceRepository.save(existingCompetence);
      return existingCompetence;
    }

    const newCompetence = this.competenceRepository.create({
      ...competenceDto,
      active: true,
    });

    return this.competenceRepository.save(newCompetence);
  }

  async update(
    id: string,
    updateCompetenceDto: UpdateCompetenceDto,
  ): Promise<Competence> {
    const existingCompetence = await this.competenceRepository.findOne({
      where: { id },
    });

    if (!existingCompetence) {
      throw new BadRequestException('Competence not found');
    }

    const isRateChanged = existingCompetence.rate !== updateCompetenceDto.rate;
    const isCurrencySame =
      existingCompetence.currency === updateCompetenceDto.currency ||
      !updateCompetenceDto.currency;
    const isUnitSame =
      existingCompetence.unit === updateCompetenceDto.unit ||
      !updateCompetenceDto.unit;

    if (isRateChanged && isCurrencySame && isUnitSame) {
      // Create a new competence with the updated rate
      const competence = omit(existingCompetence, [
        'id',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'rate',
      ]);
      const newCompetence = await this.create({
        ...competence,
        rate: updateCompetenceDto.rate as number,
      });

      // Set the old competence to inactive
      existingCompetence.active = false;
      await this.competenceRepository.save(existingCompetence);

      return newCompetence;
    }

    // If rate has not changed or currency/unit do not match, perform a simple update
    await this.competenceRepository.update(id, {
      ...updateCompetenceDto,
    });

    return this.getOne(id);
  }

  getOne(id: string): Promise<Competence> {
    return this.competenceRepository.scoped.filterById(id).getOneOrFail();
  }

  findAll<P = Competence[]>(filters?: CompetencesFilterDto) {
    const query = this.competenceRepository.scoped;
    if (filters?.active) query.filterByActive(filters?.active);
    if (filters?.withDeleted) query.withDeleted();
    if (filters?.serviceProviderId)
      query.filterByServiceProviderId(filters?.serviceProviderId);
    if (filters?.code) query.filterByCode(filters?.code);

    query.order();

    return (
      filters?.page && filters?.limit
        ? paginateResult(query, { page: filters?.page, limit: filters.limit })
        : query.getMany()
    ) as Promise<P>;
  }

  async delete(id: string) {
    await this.getOne(id);
    await this.competenceRepository.update(id, { active: false });
    await this.competenceRepository.scoped
      .filterById(id)
      .softDelete()
      .execute();

    return this.competenceRepository.scoped
      .filterById(id)
      .withDeleted()
      .getOne();
  }

  findOne(filters?: CompetencesFilterDto) {
    const query = this.competenceRepository.scoped;
    if (filters?.id) query.filterById(filters?.id);
    if (filters?.active) query.filterByActive(filters?.active);
    if (filters?.withDeleted) query.withDeleted();
    if (filters?.serviceProviderId)
      query.filterByServiceProviderId(filters?.serviceProviderId);
    if (filters?.code) query.filterByCode(filters?.code);

    return query.getOne();
  }
}
