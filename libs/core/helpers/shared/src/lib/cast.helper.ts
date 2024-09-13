import { OrderType } from '@TaskM/core/types';
import { BOOLEAN_ENUM } from '@TaskM/core/constants';
import { DayjsHelper } from './dayjs.helper';

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

const toLowerCase = (value?: string): string | undefined => {
  if (!value) return;
  return value?.toLowerCase();
};

const trim = (value?: string): string | undefined => {
  if (!value) return;
  return value?.trim();
};

const toDate = (value?: string, excludeSeconds = true): Date | undefined => {
  if (!value) return;
  return DayjsHelper.new(value, { excludeSeconds }).toDate();
};

const toBoolean = (value?: BOOLEAN_ENUM): boolean | undefined => {
  if (!value || (value && !value.trim())) return;

  value = value.trim().toLowerCase() as BOOLEAN_ENUM;

  return Object.values(BOOLEAN_ENUM).includes(value)
    ? [BOOLEAN_ENUM.ONE, BOOLEAN_ENUM.TRUE].includes(value)
    : undefined;
};

const toNumber = (
  value?: string,
  opts: ToNumberOptions = {},
): number | undefined => {
  let newValue: number | undefined = undefined;

  if (!value) {
    if (typeof opts.default === 'number') newValue = opts.default;
    else return;
  }

  if (typeof newValue === 'undefined') newValue = Number(value);

  if (opts.min && newValue < opts.min) newValue = opts.min;

  if (opts.max && newValue > opts.max) newValue = opts.max;

  return newValue;
};

const toOrder = (value?: string): OrderType | undefined => {
  if (!value) return;

  value = value.trim().toUpperCase();

  return ['ASC', 'DESC'].includes(value) ? (value as OrderType) : undefined;
};

export default {
  toLowerCase,
  trim,
  toDate,
  toBoolean,
  toNumber,
  toOrder,
};
