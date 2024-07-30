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
import { HttpErrorResponse } from '@angular/common/http';
import { BaseEnumComponent } from '@TaskM/shared/ui';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

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
    private messageService: MessageService,
    @Optional() public dialogRef: DynamicDialogRef,
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
      code: new FormControl<string>(client?.code ?? '', [Validators.required]),
      billingEmailAddress: new FormControl<string>(
        client?.billingEmailAddress ?? '',
        [Validators.required, Validators.email],
      ),
      billingPeriod: new FormControl<string>(client?.billingPeriod ?? '', [
        Validators.required,
      ]),
      currency: new FormControl<string | undefined>(client?.currency, [
        Validators.required,
      ]),
      paymentDueDays: new FormControl<number>(client?.paymentDueDays ?? 1, [
        Validators.min(1),
      ]),
      paymentMethod: new FormControl<string | undefined>(
        client?.paymentMethod,
        [Validators.required],
      ),
    });

    // Store initial form values
    this.initialFormValues = this.form.getRawValue();
  }

  get client(): ClientDto {
    return this._client;
  }

  onSubmit(): void {
    this.loading = true;

    const operation = this.client?.id
      ? this.clientService.update(this.client.id, this.form.getRawValue())
      : this.clientService.create(this.form.getRawValue());

    operation.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (client: ClientDto) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.client?.id
            ? 'Updated successfully'
            : 'Created successfully',
        });

        if (this.dialogRef && !this.client?.id) this.dialogRef.close();
        // Store form values
        this.initialFormValues = this.form.getRawValue();
        this.clientService.triggerChanges(client);
      },
      error: async (error: HttpErrorResponse) => {
        const errorMessage = await this.handleError(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });

        // Unsubscribe before resetting the form to avoid triggering the update
        if (this.formValueChangesSubscription) {
          this.formValueChangesSubscription.unsubscribe();
        }

        if (this.client.id) this.form.patchValue(this.initialFormValues); // Reset form with initial values on error

        // Resubscribe to form value changes
        this.triggerAutoSave();
      },
    });
  }

  private triggerAutoSave() {
    this.formValueChangesSubscription = this.form.valueChanges
      .pipe(
        filter(() => !!this.autoSave),
        debounceTime(1500),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
      )
      .subscribe(() => {
        this.onSubmit();
      });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return (control?.touched && control.hasError(errorName)) ?? false;
  }

  private async handleError(error: any): Promise<string> {
    let errorMessage = 'Something went wrong';

    if (error?.error?.message) {
      if (typeof error.error.message === 'string') {
        errorMessage = error.error.message;
      } else if (Array.isArray(error.error.message)) {
        for (const message of error.error.message) {
          errorMessage = message.message;
          break;
        }
      }
    }

    if (
      error.error instanceof Blob &&
      error.error.type === 'application/json'
    ) {
      try {
        const text = await error.error.text();
        const data = JSON.parse(text);
        errorMessage = data.message;
      } catch (parseError) {
        // Do nothing
      }
    }

    return errorMessage;
  }
}
