import { Component, Input, OnInit, OnDestroy, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '@TaskM/tasks/data-access';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  Subscription,
} from 'rxjs';
import {
  BaseServiceProviderDto,
  BaseProjectDto,
  CompetenceDto,
  ProjectDto,
  TaskDto,
  TaskPreviewDto,
} from '@TaskM/core/dto';
import { BaseEnumComponent, FormUtilsService } from '@TaskM/shared/misc';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormInputErrorComponent, SpinnerComponent } from '@TaskM/shared/ui';
import {
  CurrencyToIntlNumberFormat,
  LanguageCode,
  LoadUnit,
  PAGINATION,
  TaskStatus,
  TaskStatusCode,
  TaskTypeCode,
  TaskTagSeverity,
} from '@TaskM/core/constants';

import { CalendarModule } from 'primeng/calendar';
import { DayjsHelper } from '@TaskM/core/helpers';
import { ServiceProviderAutocompleteComponent } from '@TaskM/service-providers/form';
import { ProjectAutocompleteComponent } from '@TaskM/projects/form';
import { CompetenceService } from '@TaskM/service-providers/data-access';
import { ProjectService } from '@TaskM/projects/data-access';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

type DisabledFields = {
  project?: boolean;
  serviceProvider?: boolean;
  type?: boolean;
  status?: boolean;
  count?: boolean;
  assignedAt?: boolean;
  deadline?: boolean;
  rate?: boolean;
};

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule,
    InputNumberModule,
    FormInputErrorComponent,
    CalendarModule,
    ServiceProviderAutocompleteComponent,
    ProjectAutocompleteComponent,
    SpinnerComponent,
    TooltipModule,
  ],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent
  extends BaseEnumComponent
  implements OnInit, OnDestroy
{
  _task!: TaskDto | null;
  form!: FormGroup;
  loading = false;
  loadingProject = false;
  loadingCompetences = false;
  loadingTasks = false;
  project$ = new BehaviorSubject<ProjectDto | null>(null);
  competences$ = new BehaviorSubject<CompetenceDto[]>([]);
  tasks$ = new BehaviorSubject<TaskPreviewDto[] | null>(null);
  private initialFormValues: any;
  private formValueChangesSubscription!: Subscription;
  clientCurrency = '';
  CurrencyToIntlNumberFormat = CurrencyToIntlNumberFormat;
  maxAssignedAtDate: Date | null;
  minAssignedAtDate: Date | null;
  minDeadlineDate: Date | null;
  maxDeadlineDate: Date | null;
  projectReceivedAt: Date | null;
  projectDeadline: Date | null;
  loadUnit?: LoadUnit;
  rate: CompetenceDto | null = null;
  maxLoad = 0;
  remainingLoad = 0;
  private taskInitialLoad = 0;
  statusLabel: TaskStatus | null = null;
  statusCode: TaskStatusCode | null = null;
  taskTagSeverity = TaskTagSeverity;

  constructor(
    protected taskService: TaskService,
    @Optional() protected dialogRef: DynamicDialogRef,
    protected formUtils: FormUtilsService,
    protected projectService: ProjectService,
    protected competenceService: CompetenceService,
  ) {
    super();
  }

  @Input() autoSave = false;
  @Input()
  set task(task: TaskDto | null) {
    if (task) {
      this._task = task;
      this.taskInitialLoad = task.count ?? 0;
    }
    this.initializeForm(task);
  }

  get task(): TaskDto | null {
    return this._task;
  }

  ngOnInit() {
    this.initializeForm(this._task);
    this.triggerAutoSave();
    this.subscribeToTaskChanges();
    this.subscribeToStatusChange();
  }

  ngOnDestroy() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  protected initializeForm(
    task: TaskDto | null,
    disabledFields: DisabledFields = {},
  ) {
    const assignedAt = task?.assignedAt
      ? DayjsHelper.new(task.assignedAt).toDate()
      : DayjsHelper.new().add(1, 'day').toDate();
    const deadline = task?.deadline
      ? DayjsHelper.new(task.deadline).toDate()
      : DayjsHelper.new().add(2, 'day').toDate();

    if (task?.project) this.onProjectSelect(task.project);
    if (task?.serviceProvider) this.onServiceProviderSelect(task.serviceProvider);
    if (task) {
      this.statusCode = task.status;
      this.statusLabel = TaskStatus[this.statusCode];
    }

    this.form = new FormGroup({
      project: this.formUtils.createMinimalProjectForm(task?.project ?? null, {
        disabled: disabledFields.project,
      }),
      serviceProvider: this.formUtils.createMinimalServiceProviderForm(
        task?.serviceProvider ?? null,
        {
          disabled: disabledFields.serviceProvider,
        },
      ),
      type: new FormControl<string | undefined>(
        {
          value: task?.type,
          // disabled: disabledFields.type || !!task?.type,
          disabled: !!disabledFields.type,
        },
        [Validators.required],
      ),
      status: new FormControl<TaskStatusCode | undefined>(task?.status),
      lang: new FormControl<LanguageCode | undefined>(task?.lang, [
        Validators.required,
      ]),
      count: new FormControl<number>(task?.count ?? 0, [
        Validators.required,
        Validators.min(1),
      ]),
      rate: new FormControl<number | undefined>(
        {
          value: task?.rate?.rate,
          disabled: !!disabledFields?.rate,
        },
        [Validators.required, Validators.min(0.00001)],
      ),
      unit: new FormControl<LoadUnit | undefined>(task?.unit, [
        Validators.required,
      ]),
      assignedAt: new FormControl<Date>(assignedAt, [Validators.required]),
      deadline: new FormControl<Date>(deadline, [Validators.required]),
    });

    // Store initial form values
    this.initialFormValues = this.form.value;
    this.getMaxLoad();
    this.subscribeToLoadChanges();
    this.subscribeToStatusChange();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { project, serviceProvider, ...values } = this.form.getRawValue();

    const formData = {
      ...values,
      rateId: this.rate?.id,
      projectId: project?.id,
      serviceProviderId: serviceProvider?.id,
    };

    const operation = this.task?.id
      ? this.taskService.update(this.task.id, formData)
      : this.taskService.create(formData);

    operation.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (task: TaskDto) => {
        if (this.dialogRef && !this.task?.id) this.dialogRef.close();
        // Store form values
        this.initialFormValues = this.form.getRawValue();
        this.taskService.triggerChanges(task);
        this.form.markAsPristine(); //as dirty
      },
      error: (error) => {
        // Unsubscribe before resetting the form to avoid triggering the update
        if (this.formValueChangesSubscription) {
          this.formValueChangesSubscription.unsubscribe();
        }

        this.formUtils.handleErrors(this.form, error.error);

        if (this.task?.id) this.form.patchValue(this.initialFormValues); // Reset form with initial values on error

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

  onProjectSelect(project: Partial<BaseProjectDto> | null) {
    this.fetchProject(project?.id);
  }

  onServiceProviderSelect(serviceProvider: Partial<BaseServiceProviderDto> | null) {
    this.fetchCompetences(serviceProvider?.id);
  }

  protected fetchCompetences(serviceProviderId?: string, code?: TaskTypeCode): void {
    this.loadingCompetences = true;
    this.competenceService
      .getList(
        {
          serviceProviderId,
          code,
          limit: PAGINATION.MAX_LIMIT,
        },
        { error: { onError: false } },
      )
      .pipe(
        finalize(() => (this.loadingCompetences = false)),
        filter(() => !!serviceProviderId),
      )
      .subscribe((data) => {
        const competences = data.items;
        const taskType = this.form.get('type')?.value;
        if (taskType) {
          this.findRate(taskType, competences);
        }
        this.competences$.next(competences);
      });
  }

  private findRate(
    taskType: TaskTypeCode,
    competences: CompetenceDto[],
    loadUnit?: LoadUnit,
  ) {
    loadUnit = loadUnit ?? this.loadUnit;
    this.rate =
      competences?.find(
        (competence) =>
          taskType === competence.code &&
          (!loadUnit || competence.unit === loadUnit),
      ) ?? null;
    this.form.patchValue({ rate: this.rate?.rate });
  }

  private fetchProject(projectId?: string): void {
    this.loadingProject = true;
    this.projectService
      .findOne({ id: projectId }, { error: { onError: false } })
      .pipe(
        finalize(() => (this.loadingProject = false)),
        filter(() => !!projectId),
      )
      .subscribe((project) => {
        this.loadUnit = project?.unit;
        this.project$.next(project);
        this.form.patchValue({ lang: project?.lang, unit: project?.unit });
        this.getMaxLoad();
        this.getDatesBoundaries(project);
      });
  }

  protected fetchTasks(projectId?: string, type?: TaskTypeCode): void {
    if (!projectId || !type) {
      this.tasks$.next(null);
      return;
    }
    this.loadingTasks = true;
    this.taskService
      .getList(
        {
          projectId,
          task: type,
          limit: PAGINATION.MAX_LIMIT,
        },
        { error: { onError: false } },
      )
      .pipe(
        finalize(() => (this.loadingTasks = false)),
        map((data) => {
          return {
            ...data,
            items: this.task?.id
              ? data.items.filter((task) => task.id !== this.task?.id)
              : data.items,
          };
        }),
      )
      .subscribe((data) => {
        this.tasks$.next(data.items?.length ? data.items : null);
      });
  }

  protected subscribeToTaskChanges(): void {
    this.form?.get('type')?.valueChanges.subscribe((taskType) => {
      this.fetchTasks(this.projectId, taskType);
      const competences = this.competences$.value;
      this.findRate(taskType, competences);
      this.getMaxLoad();
    });
  }

  protected getMaxLoad() {
    const projectId = this.form.get('project')?.value?.id;
    const taskType = this.form.get('type')?.value;
    if (!projectId || !taskType) return;
    this.taskService
      .getRemainingLoad({
        projectId,
        task: taskType,
      })
      .pipe(filter(() => taskType && projectId))
      .subscribe((count) => {
        this.maxLoad =
          count + (this._task?.type === taskType ? this.taskInitialLoad : 0);
        this.remainingLoad = count ?? 0;
        if (this.maxLoad === this.remainingLoad)
          this.form.patchValue({ count: this.maxLoad });
      });
  }

  private get projectId(): string | undefined {
    return this.form.get('project')?.value?.id;
  }

  private subscribeToLoadChanges(): void {
    this.form.get('count')?.valueChanges.subscribe((count) => {
      this.remainingLoad = this.maxLoad - count;
    });
  }

  private getDatesBoundaries(project: ProjectDto | null) {
    this.projectReceivedAt = !project
      ? null
      : DayjsHelper.new(project.receivedAt).toDate();
    this.projectDeadline = !project
      ? null
      : DayjsHelper.new(project.internalDeadline).toDate();

    this.minAssignedAtDate = this.minDeadlineDate = this.projectReceivedAt;
    this.maxAssignedAtDate = this.maxDeadlineDate = this.projectDeadline;
  }

  private subscribeToStatusChange() {
    this.form.get('status')?.valueChanges.subscribe((status) => {
      const statusCode = status as TaskStatusCode;
      this.statusLabel = TaskStatus[statusCode];
      if (status) this.onSubmit();
    });
  }
}
