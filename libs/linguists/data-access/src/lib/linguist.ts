import {
  CompetenceDto,
  CompetencePreviewDto,
  LinguistDto,
  LinguistPreviewDto,
} from '@TaskM/core/dto';

export type Linguist = LinguistPreviewDto | LinguistDto;

export type Competence = (CompetencePreviewDto | CompetenceDto) & {
  fromId?: string;
};
