import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LinguistsService } from './linguists.service';
import {
  CreateLinguistDto,
  LinguistDto,
  UpdateLinguistDto,
  LinguistsFilterDto,
  PaginationDto,
  LinguistPreviewDto,
} from '@TaskM/core/dto';
import { Serialize } from '@TaskM/core/interceptors';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Linguist } from '@TaskM/core/db';

@Controller('linguists')
export class LinguistsController {
  constructor(private linguistsService: LinguistsService) {}

  @Serialize(LinguistDto)
  @Post()
  create(@Body() linguistDto: CreateLinguistDto) {
    return this.linguistsService.create(linguistDto);
  }

  @Serialize(LinguistDto)
  @Get('one')
  findOne(@Query() filters: LinguistsFilterDto) {
    return this.linguistsService.findOne(filters);
  }

  @Serialize(LinguistDto)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.linguistsService.getOne(id);
  }

  @Serialize(LinguistDto)
  @Patch(':id')
  update(@Param('id') id: string, @Body() linguistDto: UpdateLinguistDto) {
    return this.linguistsService.update(id, linguistDto);
  }

  @Serialize(new PaginationDto<LinguistPreviewDto>(LinguistPreviewDto))
  @Get()
  findAll(@Query() filters: LinguistsFilterDto) {
    return this.linguistsService.findAll<Pagination<Linguist>>(filters);
  }
}
