import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

function TypeFactory<T>(type: new () => T): PropertyDecorator {
  return Transform(({ value }) => {
    return value.map((item: T) => plainToInstance(type, item));
  });
}
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
  private itemType: Function;

  constructor(itemType: Function) {
    this.itemType = itemType;
  }
}
