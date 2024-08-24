import { DayjsHelper } from '@TaskM/core/helpers';
import { DateComparisonType } from '@TaskM/core/types';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import dayjs from 'dayjs';

export function dateComparisonWithTodayValidator(
  dateField: string,
  comparisonType: DateComparisonType,
  {
    dateFieldName,
    unit = 'day',
  }: { dateFieldName?: string; unit?: dayjs.OpUnitType } = {},
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateControl = control.get(dateField);
    if (!dateControl) return null;

    const date = dateControl.value;

    if (!date) return null;

    const today = DayjsHelper.new().startOf('day'); // Reference date for comparison

    let isValid = true;

    switch (comparisonType) {
      case 'greater':
        isValid = DayjsHelper.new(date).isBefore(today, unit);
        break;
      case 'greaterOrEqual':
        isValid = DayjsHelper.isBeforeOrSame(date, today, unit);
        break;
      case 'less':
        isValid = DayjsHelper.new(date).isAfter(today, unit);
        break;
      case 'lessOrEqual':
        isValid = DayjsHelper.isAfterOrSame(date, today, unit);
        break;
    }

    if (!isValid) {
      const error = {
        [`date${comparisonType[0].toUpperCase() + comparisonType.slice(1)}`]: {
          startDateField: dateFieldName ?? dateField,
          endDateField: 'today',
        },
      };
      dateControl.setErrors(error);
      dateControl.markAsTouched();
      return error;
    }

    dateControl.setErrors(null);
    return null;
  };
}
