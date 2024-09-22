import { Exclude, Expose, Type } from 'class-transformer';

export class MetaDto {
  @Expose()
  totalItems: number;

  @Expose()
  itemCount: number;

  @Expose()
  itemsPerPage: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;
}

export class PaginationDto<T> {
  @Expose()
  @Type((options) => (options?.newObject as PaginationDto<T>).itemType)
  items: T[];

  @Type(() => MetaDto)
  @Expose()
  meta: MetaDto;

  @Exclude()
  private itemType: new (...args: unknown[]) => T;

  constructor(itemType: new (...args: unknown[]) => T) {
    this.itemType = itemType;
  }
}
