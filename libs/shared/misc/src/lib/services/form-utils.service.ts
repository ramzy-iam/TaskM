import { BaseClientDto } from '@TaskM/core/dto';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isArray, isObject } from 'radash';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  isAnyFilterActivated(form: FormGroup): boolean {
    const isValueDefined = (value: any): boolean => {
      if (value === null || value === undefined || value === '') {
        return false;
      }
      if (isArray(value)) {
        return value.some(isValueDefined);
      }
      if (isObject(value)) {
        return Object.values(value).some(isValueDefined);
      }
      return true;
    };

    return Object.values(form.value).some(isValueDefined);
  }

  handleErrors(form: FormGroup, errors: { [key: string]: string }) {
    Object.keys(errors).forEach((field) => {
      const control = form.get(field);
      if (control) {
        control.setErrors({ backend: errors[field] });
      }
    });
  }

  createMinimalClientForm(client: BaseClientDto | null, required = true) {
    const validators = required ? [Validators.required] : [];
    return new FormGroup({
      id: new FormControl<string | undefined | null>(client?.id, [
        ...validators,
      ]),
      code: new FormControl<string | undefined | null>(client?.code, [
        ...validators,
      ]),
      name: new FormControl<string | undefined | null>(client?.name, [
        ...validators,
      ]),
    });
  }
}
