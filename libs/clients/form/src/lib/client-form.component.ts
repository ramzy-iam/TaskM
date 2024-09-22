import { Component, Input, OnInit, OnDestroy, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '@TaskM/clients/data-access';
import {
  FormControl,
  FormGroup,
  FormsModule,
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
import { ClientDto } from '@TaskM/core/dto';
import { BaseEnumComponent, FormUtilsService } from '@TaskM/shared/misc';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormInputErrorComponent } from '@TaskM/shared/ui';
import { Currency, PaymentMethod } from '@TaskM/core/constants';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule,
    InputNumberModule,
    FormInputErrorComponent,
  ],
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent
  extends BaseEnumComponent
  implements OnInit, OnDestroy
{
  private _client!: ClientDto;
  form!: FormGroup;
  loading = false;
  private initialFormValues: any;
  private formValueChangesSubscription!: Subscription;

  constructor(
    private clientService: ClientService,
    @Optional() public dialogRef: DynamicDialogRef,
    private formUtils: FormUtilsService,
  ) {
    super();
  }

  @Input() autoSave?: boolean = false;
  @Input()
  set client(client: ClientDto | null) {
    if (client) {
      this._client = client;
    }
    this.initializeForm(client);
  }

  ngOnInit() {
    this.initializeForm(this._client);
    this.triggerAutoSave();
  }

  ngOnDestroy() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  private initializeForm(client: ClientDto | null) {
    this.form = new FormGroup({
      name: new FormControl<string>(client?.name ?? '', [Validators.required]),
      code: new FormControl<string>(
        { value: client?.code ?? '', disabled: !!client?.id },
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ),
      billingEmailAddress: new FormControl<string>(
        client?.billingEmailAddress ?? '',
        [Validators.required, Validators.email],
      ),
      billingPeriod: new FormControl<string>(client?.billingPeriod ?? '', [
        Validators.required,
      ]),
      currency: new FormControl<Currency | undefined>(
        client?.currency ?? Currency.XAF,
        [Validators.required],
      ),
      paymentDueDays: new FormControl<number>(client?.paymentDueDays ?? 1, [
        Validators.min(1),
      ]),
      paymentMethod: new FormControl<PaymentMethod | undefined>(
        client?.paymentMethod,
        [Validators.required],
      ),
    });

    // Store initial form values
    this.initialFormValues = this.form.value;
  }

  get client(): ClientDto {
    return this._client;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const values = this.form.value;
    const operation = this.client?.id
      ? this.clientService.update(this.client.id, values)
      : this.clientService.create(values);

    operation.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (client: ClientDto) => {
        if (this.dialogRef && !this.client?.id) this.dialogRef.close();
        // Store form values
        this.initialFormValues = this.form.value;
        this.clientService.triggerChanges(client);
      },
      error: (error) => {
        // Unsubscribe before resetting the form to avoid triggering the update
        if (this.formValueChangesSubscription) {
          this.formValueChangesSubscription.unsubscribe();
        }

        this.formUtils.handleErrors(this.form, error.error);

        if (this.client?.id) this.form.patchValue(this.initialFormValues); // Reset form with initial values on error

        // Resubscribe to form value changes
        this.triggerAutoSave();
      },
    });
  }

  private triggerAutoSave() {
    this.formValueChangesSubscription = this.form.valueChanges
      .pipe(
        filter(() => !!this.autoSave),
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
