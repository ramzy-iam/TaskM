import { Component, Input, OnInit, OnDestroy, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '@TaskM/projects/data-access';
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
import { BaseClientDto, ProjectDto } from '@TaskM/core/dto';
import { BaseEnumComponent, FormUtilsService } from '@TaskM/shared/misc';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormInputErrorComponent } from '@TaskM/shared/ui';
import { CurrencyToIntlNumberFormat, LoadUnit } from '@TaskM/core/constants';

import { CalendarModule } from 'primeng/calendar';
import {
  dateComparisonValidator,
  dateComparisonWithTodayValidator,
} from '@TaskM/shared/misc';
import { DayjsHelper } from '@TaskM/core/helpers';
import { ClientAutocompleteComponent } from '@TaskM/clients/form';

type DisabledFields = {
  name?: boolean;
  client?: boolean;
  clientPoId?: boolean;
  poId?: boolean;
  taskType?: boolean;
  status?: boolean;
  lang?: boolean;
  count?: boolean;
  rate?: boolean;
  unit?: boolean;
  clientPM?: boolean;
  receivedAt?: boolean;
  deadline?: boolean;
  internalDeadline?: boolean;
};

@Component({
  selector: 'app-project-form',
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
    CalendarModule,
    ClientAutocompleteComponent,
  ],
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent
  extends BaseEnumComponent
  implements OnInit, OnDestroy
{
  _project!: ProjectDto | null;
  form!: FormGroup;
  loading = false;
  private initialFormValues: any;
  private formValueChangesSubscription!: Subscription;
  clientCurrency: string = '';
  CurrencyToIntlNumberFormat = CurrencyToIntlNumberFormat;
  maxReceivedAtDate!: Date;
  minDeadlineDate!: Date;
  minInternalDeadlineDate!: Date;
  maxInternalDeadlineDate!: Date;

  constructor(
    protected projectService: ProjectService,
    @Optional() protected dialogRef: DynamicDialogRef,
    protected formUtils: FormUtilsService,
  ) {
    super();
  }

  @Input() autoSave: boolean = false;
  @Input()
  set project(project: ProjectDto | null) {
    if (project) {
      this._project = project;
    }
    this.initializeForm(project);
  }

  ngOnInit() {
    this.initializeForm(this._project);
    this.triggerAutoSave();
  }

  ngOnDestroy() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  protected initializeForm(
    project: ProjectDto | null,
    disabledFields: DisabledFields = {},
  ) {
    this.form = new FormGroup(
      {
        client: this.formUtils.createMinimalClientForm(
          project?.client ?? null,
          { disabled: disabledFields.client },
        ),
        name: new FormControl<string | undefined>(project?.name, [
          Validators.required,
        ]),
        clientPoId: new FormControl<string | undefined>(project?.clientPoId),
        poId: new FormControl<string | undefined>({
          value: project?.poId,
          disabled: true,
        }),
        taskType: new FormControl<string | undefined>(
          {
            value: project?.taskType,
            disabled: !!project?.taskType,
          },
          [Validators.required],
        ),
        status: new FormControl<string | undefined>(project?.status),
        lang: new FormControl<string | undefined>(project?.lang, [
          Validators.required,
        ]),
        count: new FormControl<number>(project?.count ?? 0, [
          Validators.required,
          Validators.min(1),
        ]),
        rate: new FormControl<number>(project?.rate ?? 0.00001, [
          Validators.required,
          Validators.min(0.00001),
        ]),
        unit: new FormControl<LoadUnit | undefined>(project?.unit, [
          Validators.required,
        ]),
        clientPM: new FormControl<string>(project?.clientPM ?? '', [
          Validators.required,
        ]),
        receivedAt: new FormControl<Date>(
          DayjsHelper.new(project?.receivedAt).toDate(),
          [Validators.required],
        ),
        deadline: new FormControl<Date>(
          DayjsHelper.new(project?.deadline).toDate(),
          [Validators.required],
        ),

        internalDeadline: new FormControl<Date>(
          DayjsHelper.new(project?.internalDeadline).toDate(),
          [Validators.required],
        ),
      },
      [
        dateComparisonWithTodayValidator('receivedAt', 'greaterOrEqual', {
          dateFieldName: 'Received At',
        }),
        dateComparisonValidator('receivedAt', 'deadline', 'greater', {
          startDateFieldName: 'Received At',
          endDateFieldName: 'Deadline',
        }),
        dateComparisonValidator('receivedAt', 'internalDeadline', 'greater', {
          startDateFieldName: 'Received At',
          endDateFieldName: 'Internal Deadline',
        }),
        dateComparisonValidator(
          'internalDeadline',
          'deadline',
          'greaterOrEqual',
          {
            startDateFieldName: 'Internal Deadline',
            endDateFieldName: 'Deadline',
          },
        ),
      ],
    );

    if (project?.client) {
      this.clientCurrency = project.client.currency;
    }

    // Store initial form values
    this.initialFormValues = this.form.value;
    this.setupDeadlineListeners();
  }

  private setupDeadlineListeners() {
    const receivedAtControl = this.form.get('receivedAt');
    const deadlineControl = this.form.get('deadline');
    const internalDeadlineControl = this.form.get('internalDeadline');

    const updateDateLimits = () => {
      const receivedAt = receivedAtControl?.value;
      const deadline = deadlineControl?.value;
      this.maxReceivedAtDate = DayjsHelper.new().toDate();

      if (receivedAt)
        this.minDeadlineDate = this.minInternalDeadlineDate = receivedAt;

      if (deadline) this.maxInternalDeadlineDate = deadline;
    };

    // Initialize limits
    updateDateLimits();

    // Update min and max dates on value changes
    receivedAtControl?.valueChanges.subscribe(() => {
      updateDateLimits();
    });

    deadlineControl?.valueChanges.subscribe((deadline: Date) => {
      if (
        internalDeadlineControl?.value &&
        DayjsHelper.new(internalDeadlineControl.value).isAfter(deadline)
      ) {
        internalDeadlineControl.setValue(
          DayjsHelper.new(deadline).subtract(1, 'day').toDate(),
          { emitEvent: false },
        );
      }
      updateDateLimits();
    });
  }

  get project(): ProjectDto | null {
    return this._project;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const values = this.form.getRawValue();

    const operation = this.project?.id
      ? this.projectService.update(this.project.id, values)
      : this.projectService.create(values);

    operation.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (project: ProjectDto) => {
        if (this.dialogRef && !this.project?.id) this.dialogRef.close();
        // Store form values
        this.initialFormValues = this.form.getRawValue();
        this.projectService.triggerChanges(project);
      },
      error: (error) => {
        // Unsubscribe before resetting the form to avoid triggering the update
        if (this.formValueChangesSubscription) {
          this.formValueChangesSubscription.unsubscribe();
        }

        this.formUtils.handleErrors(this.form, error.error);

        if (this.project?.id) this.form.patchValue(this.initialFormValues); // Reset form with initial values on error

        // Resubscribe to form value changes
        this.triggerAutoSave();
      },
    });
  }

  protected triggerAutoSave(force = false) {
    this.formValueChangesSubscription = this.form?.valueChanges
      .pipe(
        filter(() => !!this.autoSave || !!force),
        debounceTime(3000),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
      )
      .subscribe(() => {
        this.onSubmit();
      });
  }

  getNestedFormGroup(path: string): FormGroup {
    return this.form.get(path) as FormGroup;
  }

  onClientSelect(client: BaseClientDto | null) {
    this.clientCurrency = client?.currency ?? '';
  }
}
