import { Column, ColumnOptions } from 'typeorm';

export function DateTzColumn(options?: ColumnOptions): PropertyDecorator {
  return Column({ ...options, type: 'timestamptz' });
}

export function AmountColumn(options?: ColumnOptions): PropertyDecorator {
  return Column({ precision: 20, scale: 6, ...options, type: 'decimal' });
}
