import { BaseClientDto } from '@TaskM/core/dto';
import { Injectable } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormControl,
  Validators,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  isAnyFilterActivated(form: FormGroup): boolean {
    return Object.values(form.controls).some((control: AbstractControl) => {
      if (control instanceof FormGroup) {
        return this.isAnyFilterActivated(control);
      }
      return (
        control.value != null &&
        control.value !== '' &&
        control.value !== undefined
      );
    });
  }

  handleErrors(form: FormGroup, errors: { [key: string]: string }) {
    Object.keys(errors).forEach((field) => {
      const control = form.get(field);
      if (control) {
        control.setErrors({ backend: errors[field] });
      }
    });
  }

  createMinimalClientForm(
    client: BaseClientDto | null,
    required = true,
  ): FormGroup {
    const validators = required ? [Validators.required] : [];
    return new FormGroup({
      id: new FormControl<string | undefined>(
        {
          value: client?.id,
          disabled: true,
        },
        [...validators],
      ),
      code: new FormControl<string | undefined>(
        {
          value: client?.code,
          disabled: true,
        },
        [...validators],
      ),
      name: new FormControl<string>(client?.name ?? '', [...validators]),
    });
  }
}
