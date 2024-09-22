import { BadRequestException, Injectable } from '@nestjs/common';
import { Competence, CompetencesRepository } from '@TaskM/core/db';
import {
  CompetencesFilterDto,
  CreateCompetenceDto,
  UpdateCompetenceDto,
} from '@TaskM/core/dto';
import { paginateResult } from '@TaskM/core/helpers/backend';

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
      .getOne();

    if (existingCompetence) {
      existingCompetence.active = true;
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
      // Set the current competence to inactive
      existingCompetence.active = false;
      await this.competenceRepository.save(existingCompetence);

      // Create a new competence with the updated rate
      const { id, ...competence } = existingCompetence;
      return this.create({
        ...competence,
        rate: updateCompetenceDto.rate!,
      });
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
