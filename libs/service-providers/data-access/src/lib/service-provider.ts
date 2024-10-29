import {
  CompetenceDto,
  CompetencePreviewDto,
  ServiceProviderDto,
  ServiceProviderPreviewDto,
} from '@TaskM/core/dto';

export type ServiceProvider = ServiceProviderPreviewDto | ServiceProviderDto;

export type Competence = (CompetencePreviewDto | CompetenceDto) & {
  fromId?: string;
};
