import { DayjsHelper } from '@TaskM/core/helpers';
import { DateComparisonType } from '@TaskM/core/types';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import dayjs from 'dayjs';

export function dateComparisonValidator(
  startDateField: string,
  endDateField: string,
  comparisonType: DateComparisonType,
  {
    startDateFieldName,
    endDateFieldName,
  }: { startDateFieldName?: string; endDateFieldName?: string } = {},
  unit?: dayjs.OpUnitType,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDateControl = control.get(startDateField);
    const endDateControl = control.get(endDateField);
    if (!startDateControl || !endDateControl) return null;

    const startDate = startDateControl.value;
    const endDate = endDateControl.value;

    if (!startDate || !endDate) return null;

    let isValid = true;

    switch (comparisonType) {
      case 'greater':
        isValid = DayjsHelper.new(startDate).isBefore(endDate, unit);
        break;
      case 'greaterOrEqual':
        isValid = DayjsHelper.isBeforeOrSame(startDate, endDate, unit);
        break;
      case 'less':
        isValid = DayjsHelper.new(startDate).isAfter(endDate, unit);
        break;
      case 'lessOrEqual':
        isValid = DayjsHelper.isAfterOrSame(startDate, endDate, unit);
        break;
    }

    if (!isValid) {
      const error = {
        [`date${comparisonType[0].toUpperCase() + comparisonType.slice(1)}`]: {
          startDateField: startDateFieldName ?? startDateField,
          endDateField: endDateFieldName ?? endDateField,
        },
      };
      startDateControl.setErrors(error);
      endDateControl.setErrors(error);
      startDateControl.markAsTouched();
      endDateControl.markAsTouched();
      return error;
    }

    startDateControl.setErrors(null);
    endDateControl.setErrors(null);
    return null;
  };
}
