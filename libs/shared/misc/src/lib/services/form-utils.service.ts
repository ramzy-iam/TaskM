import {
  BaseClientDto,
  BaseLinguistDto,
  BaseProjectDto,
} from '@TaskM/core/dto';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
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

  getDirtyValues(form: FormGroup | FormArray): any {
    const dirtyValues: any = {};

    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);

      if (control instanceof FormGroup) {
        const groupDirtyValues = this.getDirtyValues(control);
        if (Object.keys(groupDirtyValues).length > 0) {
          // Use groupDirtyValues here
          dirtyValues[key] = groupDirtyValues;
        }
      } else if (control instanceof FormArray) {
        const arrayDirtyValues = control.controls
          .map((c) => this.getDirtyValues(c as FormGroup))
          .filter((val) => Object.keys(val).length > 0);

        if (arrayDirtyValues.length > 0) {
          dirtyValues[key] = arrayDirtyValues;
        }
      } else if (control instanceof FormControl && control.dirty) {
        dirtyValues[key] = control.value;
      }
    });

    return dirtyValues;
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
    {
      required = true,
      disabled = false,
    }: { required?: boolean; disabled?: boolean },
  ) {
    const validators = required ? [Validators.required] : [];
    return new FormGroup({
      id: new FormControl<string | undefined | null>(
        {
          value: client?.id,
          disabled,
        },
        [...validators],
      ),
      code: new FormControl<string | undefined | null>(
        {
          value: client?.code,
          disabled,
        },
        [...validators],
      ),
      name: new FormControl<string | undefined | null>(
        {
          value: client?.name,
          disabled,
        },
        [...validators],
      ),
    });
  }

  createMinimalProjectForm(
    project: BaseProjectDto | null,
    {
      required = true,
      disabled = false,
    }: { required?: boolean; disabled?: boolean },
  ) {
    const validators = required ? [Validators.required] : [];
    return new FormGroup({
      id: new FormControl<string | undefined | null>(
        {
          value: project?.id,
          disabled,
        },
        [...validators],
      ),
      code: new FormControl<string | undefined | null>(
        {
          value: project?.poId,
          disabled,
        },
        [...validators],
      ),
      name: new FormControl<string | undefined | null>(
        {
          value: project?.name,
          disabled,
        },
        [...validators],
      ),
    });
  }

  createMinimalLinguistForm(
    linguist: BaseLinguistDto | null,
    {
      required = true,
      disabled = false,
    }: { required?: boolean; disabled?: boolean },
  ) {
    const validators = required ? [Validators.required] : [];
    return new FormGroup({
      id: new FormControl<string | undefined | null>(
        {
          value: linguist?.id,
          disabled,
        },
        [...validators],
      ),
      name: new FormControl<string | undefined | null>(
        {
          value: linguist?.fullName,
          disabled,
        },
        [...validators],
      ),
      //   email: new FormControl<string | undefined | null>(
      //     {
      //       value: linguist?.email,
      //       disabled,
      //     },
      //     [...validators],
      //   ),
      //   firstName: new FormControl<string | undefined | null>(
      //     {
      //       value: linguist?.firstName,
      //       disabled,
      //     },
      //     [...validators],
      //   ),
      //   lastName: new FormControl<string | undefined | null>(
      //     {
      //       value: linguist?.lastName,
      //       disabled,
      //     },
      //     [...validators],
      //   ),
    });
  }
}
