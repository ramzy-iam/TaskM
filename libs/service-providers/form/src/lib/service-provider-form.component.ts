import { Component, Input, OnInit, OnDestroy, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceProviderService } from '@TaskM/service-providers/data-access';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  Subscription,
} from 'rxjs';
import { ServiceProviderDto } from '@TaskM/core/dto';
import { BaseEnumComponent, FormUtilsService } from '@TaskM/shared/misc';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormInputErrorComponent } from '@TaskM/shared/ui';

@Component({
  selector: 'app-service-provider-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule,
    InputNumberModule,
    FormInputErrorComponent,
  ],
  templateUrl: './service-provider-form.component.html',
})
export class ServiceProviderFormComponent
  extends BaseEnumComponent
  implements OnInit, OnDestroy
{
  private serviceProviderService = inject(ServiceProviderService);
  dialogRef = inject(DynamicDialogRef, { optional: true });
  private formUtils = inject(FormUtilsService);

  private _serviceProvider!: ServiceProviderDto;
  form!: FormGroup;
  loading = false;
  private initialFormValues: any;
  private formValueChangesSubscription!: Subscription;

  readonly autoSave = input<boolean | undefined>(false);
  @Input()
  set serviceProvider(serviceProvider: ServiceProviderDto | null) {
    if (serviceProvider) {
      this._serviceProvider = serviceProvider;
    }
    this.initializeForm(serviceProvider);
  }
  get serviceProvider(): ServiceProviderDto {
    return this._serviceProvider;
  }

  ngOnInit() {
    this.initializeForm(this._serviceProvider);
    this.triggerAutoSave();
  }

  ngOnDestroy() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  private initializeForm(serviceProvider: ServiceProviderDto | null) {
    this.form = new FormGroup({
      firstName: new FormControl<string | undefined>(
        serviceProvider?.firstName,
        [Validators.required],
      ),
      lastName: new FormControl<string | undefined>(serviceProvider?.lastName, [
        Validators.required,
      ]),
      email: new FormControl<string | undefined>(serviceProvider?.email, [
        Validators.required,
        Validators.email,
      ]),
      accountType: new FormControl<string>(serviceProvider?.accountType ?? '', [
        Validators.required,
      ]),
      accountName: new FormControl<string | undefined>(
        serviceProvider?.accountName,
        [Validators.required],
      ),
      accountNumber: new FormControl<string | undefined>(
        serviceProvider?.accountNumber,
        [Validators.required],
      ),
      phone: new FormControl<string | undefined>(serviceProvider?.phone, [
        Validators.required,
      ]),
    });

    // Store initial form values
    this.initialFormValues = this.form.value;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const values = !this.serviceProvider?.id
      ? this.form.value
      : this.formUtils.getDirtyValues(this.form);
    const operation = this.serviceProvider?.id
      ? this.serviceProviderService.update(this.serviceProvider.id, values)
      : this.serviceProviderService.create(values);

    operation.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (serviceProvider: ServiceProviderDto) => {
        if (this.dialogRef && !this.serviceProvider?.id) this.dialogRef.close();
        // Store form values
        this.initialFormValues = this.form.value;
        this.serviceProviderService.triggerChanges(serviceProvider);
      },
      error: (error) => {
        // Unsubscribe before resetting the form to avoid triggering the update
        if (this.formValueChangesSubscription) {
          this.formValueChangesSubscription.unsubscribe();
        }

        this.formUtils.handleErrors(this.form, error.error);

        if (this.serviceProvider?.id)
          this.form.patchValue(this.initialFormValues); // Reset form with initial values on error

        // Resubscribe to form value changes
        this.triggerAutoSave();
      },
    });
  }

  private triggerAutoSave() {
    this.formValueChangesSubscription = this.form.valueChanges
      .pipe(
        filter(() => !!this.autoSave()),
        debounceTime(3000),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
      )
      .subscribe(() => {
        this.onSubmit();
      });
  }
}
