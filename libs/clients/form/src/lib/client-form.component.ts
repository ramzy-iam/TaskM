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
import { BaseEnumComponent } from '@TaskM/shared/ui';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';

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
  private codeParam!: string;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.queryParams.subscribe((params) => {
      this.codeParam = params['selectedCode'];
    });

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const operation = this.client?.id
      ? this.clientService.update(this.client.id, this.form.getRawValue())
      : this.clientService.create(this.form.getRawValue());

    operation.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (client: ClientDto) => {
        if (this.dialogRef && !this.client?.id) this.dialogRef.close();
        // Store form values
        this.initialFormValues = this.form.getRawValue();
        // Update query params if the code has changed
        this.trackCodeChanges();

        this.clientService.triggerChanges(client);
      },
      error: () => {
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
        debounceTime(2000),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
      )
      .subscribe(() => {
        this.onSubmit();
      });
  }

  private trackCodeChanges() {
    if (this.client.id && this.form.get('code')?.value !== this.codeParam) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { selectedClient: this.form.get('code')?.value },
        queryParamsHandling: 'merge',
      });
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return (control?.touched && control.hasError(errorName)) ?? false;
  }
}
