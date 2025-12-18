import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup } from '@angular/forms';
import { getValidatorErrorMessage } from './validations-utils';

@Component({
  selector: 'input-error',
  imports: [CommonModule],
  template: `
    @if (errorMessage !== null) {
      <small class="text-red-400">
        {{ errorMessage }}
      </small>
    }
  `,
})
export class FormInputErrorComponent {
  readonly control = input.required<AbstractControl>();
  readonly formGroup = input<FormGroup>();
  readonly fieldName = input<string>();

  get errorMessage() {
    for (const validatorName in this.control()?.errors) {
      const control = this.control();
      if (control.touched) {
        const fieldName =
          this.fieldName() ??
          this.getControlName(this.formGroup() as FormGroup, control) ??
          'This field';
        return getValidatorErrorMessage(
          validatorName,
          control?.errors?.[validatorName],
          fieldName,
        );
      }
    }
    return null;
  }

  private getControlName(
    group: FormGroup | undefined,
    control: AbstractControl,
  ): string | undefined {
    if (!group) return undefined;

    let controlName: string | undefined;

    Object.keys(group.controls).forEach((name) => {
      const currentControl = group.get(name);

      if (currentControl === control) {
        controlName = name;
      } else if (currentControl instanceof FormGroup) {
        const nestedControlName = this.getControlName(currentControl, control);
        if (nestedControlName) {
          controlName = `${name}.${nestedControlName}`;
        }
      }
    });

    return controlName;
  }
}
