import { Component, Input, OnInit, OnDestroy, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetenceService } from '@TaskM/service-providers/data-access';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { CompetenceDto } from '@TaskM/core/dto';
import { BaseEnumComponent, FormUtilsService } from '@TaskM/shared/misc';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormInputErrorComponent } from '@TaskM/shared/ui';
import {
  Currency,
  CurrencyToIntlNumberFormat,
  LoadUnit,
} from '@TaskM/core/constants';

@Component({
  selector: 'app-competence-form',
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
  templateUrl: './competence-form.component.html',
})
export class CompetenceFormComponent
  extends BaseEnumComponent
  implements OnInit, OnDestroy
{
  private _competence!: CompetenceDto;
  form!: FormGroup;
  loading = false;
  private initialFormValues: any;
  private formValueChangesSubscription!: Subscription;
  CurrencyToIntlNumberFormat = CurrencyToIntlNumberFormat;
  availableTasks: { value: string; name: string }[] = [];
  private existingCompetences: CompetenceDto[] = [];

  constructor(
    private competenceService: CompetenceService,
    @Optional() public dialogRef: DynamicDialogRef,
    private formUtils: FormUtilsService,
    private dialogConfig: DynamicDialogConfig,
  ) {
    super();
    if (this.dialogConfig?.data?.competence) {
      this.competence = this.dialogConfig.data.competence;
    }
    this.existingCompetences =
      this.dialogConfig?.data?.serviceProviderCompetences ?? [];
    this.excludeTasks();
  }

  @Input() autoSave?: boolean = false;
  @Input()
  set competence(competence: CompetenceDto | null) {
    if (competence) {
      this._competence = competence;
    }
    this.initializeForm(competence);
  }

  get competence(): CompetenceDto {
    return this._competence;
  }

  ngOnInit() {
    this.initializeForm(this._competence);
  }

  ngOnDestroy() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  private initializeForm(competence: CompetenceDto | null) {
    this.form = new FormGroup({
      code: new FormControl<string | undefined>(
        {
          value: competence?.code,
          disabled: !!competence?.code,
        },
        [Validators.required],
      ),

      rate: new FormControl<number>(competence?.rate ?? 0.00001, [
        Validators.required,
        Validators.min(0.00001),
      ]),
      unit: new FormControl<LoadUnit | undefined>(
        {
          value: competence?.unit,
          disabled: !!competence?.unit,
        },
        [Validators.required],
      ),
      currency: new FormControl<Currency | undefined>(
        competence?.currency ?? Currency.XAF,
        [Validators.required],
      ),
      serviceProviderId: new FormControl<string | undefined>(competence?.serviceProviderId),
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
    const values = !this.competence?.id
      ? this.form.value
      : this.formUtils.getDirtyValues(this.form);
    const operation = this.competence?.id
      ? this.competenceService.update(this.competence.id, values)
      : this.competenceService.create(values);

    operation.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (competence: CompetenceDto) => {
        if (this.dialogRef) this.dialogRef.close();
        // Store form values
        this.initialFormValues = this.form.value;
        this.competenceService.triggerChanges({
          ...competence,
          fromId: this.competence?.id,
        });
      },
      error: (error) => {
        // Unsubscribe before resetting the form to avoid triggering the update
        if (this.formValueChangesSubscription) {
          this.formValueChangesSubscription.unsubscribe();
        }

        this.formUtils.handleErrors(this.form, error.error);

        if (this.competence?.id) this.form.patchValue(this.initialFormValues); // Reset form with initial values on error
      },
    });
  }

  private excludeTasks() {
    this.availableTasks = this.taskTypes.filter(
      (t) => !this.existingCompetences.find((c) => c.code === t.value),
    );
  }
}
