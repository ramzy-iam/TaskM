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
  map,
  max,
  Subscription,
} from 'rxjs';
import { ProjectDto } from '@TaskM/core/dto';
import { BaseEnumComponent, FormUtilsService } from '@TaskM/shared/misc';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormInputErrorComponent } from '@TaskM/shared/ui';
import { ClientService } from '@TaskM/clients/data-access';
import { Currency, CurrencyToIntlNumberFormat } from '@TaskM/core/constants';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import {
  dateComparisonValidator,
  dateComparisonWithTodayValidator,
} from '@TaskM/shared/misc';
import { DayjsHelper } from '@TaskM/core/helpers';

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
    AutoCompleteModule,
    CalendarModule,
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
  filteredClients: { name: string; value: string; currency: Currency }[] = [];
  totalRecords = 0;
  searchQuery = '';
  page = 1;
  limit = 15;
  clientCurrency: string = '';
  CurrencyToIntlNumberFormat = CurrencyToIntlNumberFormat;
  maxReceivedAtDate!: Date;
  minDeadlineDate!: Date;
  minInternalDeadlineDate!: Date;
  maxInternalDeadlineDate!: Date;

  constructor(
    private projectService: ProjectService,
    private clientService: ClientService,
    @Optional() public dialogRef: DynamicDialogRef,
    private formUtils: FormUtilsService,
  ) {
    super();
  }

  @Input() autoSave?: boolean = false;
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
    this.setupDeadlineListeners();
  }

  ngOnDestroy() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  private initializeForm(project: ProjectDto | null) {
    this.form = new FormGroup(
      {
        client: new FormGroup({
          id: new FormControl<string | undefined>(
            {
              value: project?.client?.id,
              disabled: true,
            },
            [Validators.required],
          ),
          code: new FormControl<string | undefined>(
            {
              value: project?.client?.code,
              disabled: true,
            },
            [Validators.required],
          ),
          name: new FormControl<string>(project?.client?.name ?? '', [
            Validators.required,
          ]),
        }),
        name: new FormControl<string>(project?.name ?? '', [
          Validators.required,
        ]),
        clientPoId: new FormControl<string>(project?.clientPoId ?? ''),
        poId: new FormControl<string | undefined>({
          value: project?.poId,
          disabled: true,
        }),
        taskType: new FormControl<string>(project?.taskType ?? '', [
          Validators.required,
        ]),
        status: new FormControl<string | undefined>(project?.status),
        lang: new FormControl<string>(project?.lang ?? '', [
          Validators.required,
        ]),
        count: new FormControl<number>(project?.count ?? 0, [
          Validators.required,
          Validators.min(1),
        ]),
        rate: new FormControl<number>(project?.rate ?? 0, [
          Validators.required,
          Validators.min(0.00001),
        ]),
        unit: new FormControl<string>(project?.lang ?? '', [
          Validators.required,
        ]),
        clientPM: new FormControl<string>(project?.lang ?? '', [
          Validators.required,
        ]),
        receivedAt: new FormControl<Date>(
          project?.receivedAt ?? DayjsHelper.new().toDate(),
          [Validators.required],
        ),
        deadline: new FormControl<Date>(
          project?.deadline ?? DayjsHelper.new().add(2, 'day').toDate(),
          [Validators.required],
        ),

        internalDeadline: new FormControl<Date>(
          project?.internalDeadline ?? DayjsHelper.new().add(1, 'day').toDate(),
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

    // Store initial form values
    this.initialFormValues = this.form.getRawValue();
  }

  private setupDeadlineListeners() {
    const receivedAtControl = this.form.get('receivedAt');
    const deadlineControl = this.form.get('deadline');
    const internalDeadlineControl = this.form.get('internalDeadline');

    const updateDateLimits = () => {
      const receivedAt = receivedAtControl?.value;
      const deadline = deadlineControl?.value;
      this.maxReceivedAtDate = DayjsHelper.new().toDate();

      if (receivedAt) {
        this.minDeadlineDate = receivedAt;
        this.minInternalDeadlineDate = receivedAt;
      }

      if (deadline) {
        this.maxInternalDeadlineDate = deadline;
      }
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

    const operation = this.project?.id
      ? this.projectService.update(this.project.id, this.form.getRawValue())
      : this.projectService.create(this.form.getRawValue());

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

  getNestedFormGroup(path: string): FormGroup {
    return this.form.get(path) as FormGroup;
  }

  searchClients(event: AutoCompleteCompleteEvent) {
    this.searchQuery = event.query;
    this.page = 1; // Reset to first page on new search
    this.loadClients();
  }

  loadClients() {
    this.clientService
      .getList(
        { page: this.page, limit: this.limit, query: this.searchQuery },
        {
          error: { message: 'Failed to load clients' },
          success: { onSuccess: false },
        },
      )
      .pipe(
        map((data) =>
          data.items.map((client) => ({
            name: client.name,
            value: client.id,
            currency: client.currency,
            code: client.code,
          })),
        ),
      )
      .subscribe((response) => {
        this.filteredClients = response;
      });
  }

  onClientSelect(event: AutoCompleteSelectEvent) {
    this.clientCurrency = event.value?.currency ?? '';
    this.form.patchValue({
      client: {
        id: event.value.value,
        name: event.value.name,
        code: event.value.code,
      },
    });
  }
}
