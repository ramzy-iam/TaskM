import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

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
}
