import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(createCompetenceDto: CreateCompetenceDto): Promise<Competence> {
    const existingCompetence = await this.competenceRepository.scoped
      .filterByLinguistId(createCompetenceDto.linguistId)
      .filterByCode(createCompetenceDto.code)
      .filterByUnit(createCompetenceDto.unit)
      .filterByCurrency(createCompetenceDto.currency)
      .filterByRate(createCompetenceDto.rate)
      .withDeleted()
      .getOne();

    if (existingCompetence) {
      existingCompetence.active = true;
      existingCompetence.deletedAt = null;
      await this.competenceRepository.save(existingCompetence);
      return existingCompetence;
    }

    const newCompetence = this.competenceRepository.create({
      ...createCompetenceDto,
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
    if (filters?.linguistId) query.filterByLinguistId(filters?.linguistId);
    if (filters?.code) query.filterByCode(filters?.code);

    query._orderBy();

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
    if (filters?.linguistId) query.filterByLinguistId(filters?.linguistId);
    if (filters?.code) query.filterByCode(filters?.code);

    return query.getOne();
  }
}
