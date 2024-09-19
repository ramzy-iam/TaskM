import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '@TaskM/shared/layout';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixCross2 } from '@ng-icons/radix-icons';
import {
  InputSearchComponent,
  ListItemComponent,
  NoDataComponent,
  SpinnerComponent,
  TagComponent,
} from '@TaskM/shared/ui';
import { Task, TaskService } from '@TaskM/tasks/data-access';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
} from 'rxjs';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TaskPreviewDto, TasksFilterDto } from '@TaskM/core/dto';
import { TaskDetailsComponent } from '@TaskM/tasks/feature-details';
import { TaskFormComponent } from '@TaskM/tasks/form';
import { SkeletonModule } from 'primeng/skeleton';
import { FormUtilsService, ScrollNearEndDirective } from '@TaskM/shared/misc';
import {
  PAGINATION,
  TaskStatus,
  TaskStatusCode,
  TaskTagSeverity,
  TaskType,
  TaskTypeCode,
} from '@TaskM/core/constants';
import { Nullable } from '@TaskM/core/types';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { LinguistAutocompleteComponent } from '@TaskM/linguists/form';
import { CalendarModule } from 'primeng/calendar';
import { DayjsHelper } from '@TaskM/core/helpers';
import { ProjectService } from '@TaskM/projects/data-access';
import { ProjectAutocompleteComponent } from '@TaskM/projects/form';

type UrlParams = TasksFilterDto & {
  selectedTask: string | null;
  project?: string;
};

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconComponent,
    SectionHeaderComponent,
    ButtonModule,
    InputTextModule,
    InputSearchComponent,
    ListItemComponent,
    TaskDetailsComponent,
    DialogModule,
    SkeletonModule,
    SpinnerComponent,
    ScrollNearEndDirective,
    NoDataComponent,
    TagComponent,
    MultiSelectModule,
    DropdownModule,
    LinguistAutocompleteComponent,
    ProjectAutocompleteComponent,
    CalendarModule,
  ],
  providers: [DialogService, provideIcons({ radixCross2 })],
  templateUrl: './task-list.component.html',
  host: { class: 'h-full py-1' },
})
export class TaskListComponent implements OnInit, OnDestroy {
  loading = false;
  isLoadingMore = false;
  private page = PAGINATION.DEFAULT_PAGE;
  private limit = PAGINATION.DEFAULT_LIMIT;
  private hasMore = true;
  filterForm!: FormGroup<{
    query: FormControl<string | null>;
    status: FormControl<{
      code: TaskStatusCode | null;
      name: string | null;
    } | null>;
    task: FormControl<{
      code: TaskTypeCode | null;
      name: string | null;
    } | null>;
    project: FormGroup<{
      id: FormControl<string | null | undefined>;
      code: FormControl<string | null | undefined>;
      name: FormControl<string | null | undefined>;
    }>;
    linguist: FormGroup<{
      id: FormControl<string | null | undefined>;
      name: FormControl<string | null | undefined>;
    }>;
    period: FormControl<(Date | null)[] | null | undefined>;
  }>;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  selectedTaskCode: string | null = null;
  dialogRef?: DynamicDialogRef;
  isFilterActivated = false;
  taskTagSeverity = TaskTagSeverity;
  taskStatus = Object.keys(TaskStatus).map((key) => ({
    code: key,
    name: TaskStatus[key as keyof typeof TaskStatusCode],
  }));

  taskTypes = Object.entries(TaskType).map(([key, value]) => ({
    code: key,
    name: value,
  }));

  private isFormInitialized = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private formUtils: FormUtilsService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.initializeFilterForm();
    this.subscribeToFilterChanges();
    this.subscribeToRouteParams();
    this.subscribeToTaskChanges();
  }

  showCreateDialog(): void {
    this.dialogRef = this.dialogService.open(TaskFormComponent, {
      header: 'New Task',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { autoSave: true },
    });
  }

  private resetAndFetchTasks(filters?: Nullable<TasksFilterDto>): void {
    this.page = PAGINATION.DEFAULT_PAGE;
    this.hasMore = true;
    this.tasksSubject.next([]);
    this.fetchTasks(filters);
  }

  private subscribeToTaskChanges(): void {
    this.taskService.getChanges().subscribe((task) => {
      if (task) {
        this.handleTaskUpdate(task);
      }
    });
  }

  private handleTaskUpdate(task: TaskPreviewDto): void {
    const currentTasks = this.tasksSubject.getValue();
    const index = currentTasks.findIndex((t) => t.id === task.id);

    if (index !== -1) {
      currentTasks[index] = task;
    } else {
      currentTasks.unshift(task);
    }

    this.tasksSubject.next(currentTasks);
  }

  private fetchTasks(filters?: Nullable<TasksFilterDto>): void {
    if (this.loading || (this.isLoadingMore && !this.hasMore)) return;

    this.setLoadingState(this.isInitialLoad(), !this.isInitialLoad());

    this.taskService
      .getList({
        ...filters,
        query: filters?.query,
        page: this.page,
        limit: this.limit,
      })
      .pipe(finalize(() => this.setLoadingState(false, false)))
      .subscribe((data) => {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next(
          this.isInitialLoad() ? data.items : [...currentTasks, ...data.items],
        );

        this.hasMore = this.page < data.meta.totalPages;
        if (this.hasMore) this.page++;
      });
  }

  private setLoadingState(loading: boolean, isLoadingMore: boolean): void {
    this.loading = loading;
    this.isLoadingMore = isLoadingMore;
  }

  onCloseChild(): void {
    this.selectedTaskCode = null;
    this.selectTask(null);
  }

  selectTask(taskCode: string | null): void {
    this.router.navigate([], {
      queryParams: { selectedTask: taskCode },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }

  onNearEndScroll(): void {
    if (!this.isLoadingMore && this.hasMore) {
      this.setLoadingState(false, true);
      this.fetchTasks(this.buildFilter());
    }
  }

  private isInitialLoad(): boolean {
    return this.page === PAGINATION.DEFAULT_PAGE;
  }

  private initializeFilterForm(): void {
    const params = this.route.snapshot.queryParams as UrlParams;

    this.filterForm = new FormGroup({
      query: new FormControl<string | null>(params?.query ?? null),
      status: new FormControl<{
        code: TaskStatusCode | null;
        name: string | null;
      } | null>({
        code: params?.status ?? null,
        name: TaskStatus[params?.status!] ?? null,
      }),
      task: new FormControl<{
        code: TaskTypeCode | null;
        name: string | null;
      } | null>({
        code: params?.task ?? null,
        name: TaskType[params.task!] ?? null,
      }),
      project: this.formUtils.createMinimalClientForm(null, {}),
      linguist: this.formUtils.createMinimalLinguistForm(null, {}),
      period: new FormControl<(Date | null)[] | null | undefined>(
        this.getPeriodFromParams(params),
      ),
    });

    if (params?.project) {
      this.loadProjectByCode(params?.project);
    } else {
      this.isFormInitialized = true;
      this.resetAndFetchTasks(this.buildFilter());
      this.router.navigate([], {
        queryParams: { project: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  private getPeriodFromParams(params: Params): (Date | null)[] | null {
    if (params['from'] && params['to']) {
      return [
        DayjsHelper.new(params['from']).toDate(),
        DayjsHelper.new(params['to']).toDate(),
      ];
    }

    if (params['from']) {
      return [DayjsHelper.new(params['from']).toDate(), null];
    }

    return null;
  }

  private subscribeToFilterChanges(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(() => this.isFormInitialized),
      )
      .subscribe(() => {
        this.isFilterActivated = this.formUtils.isAnyFilterActivated(
          this.filterForm,
        );
        this.updateUrlParams(this.buildFilter());
      });
  }

  private subscribeToRouteParams(): void {
    // Subscriber for selectedTaskCode
    this.route.queryParams
      .pipe(
        distinctUntilChanged(
          (prev, curr) => prev['selectedTask'] === curr['selectedTask'],
        ),
      )
      .subscribe((params) => {
        this.selectedTaskCode = params['selectedTask'] ?? null;
      });

    // Subscriber for other route params
    this.route.queryParams
      .pipe(
        filter(() => this.isFormInitialized),
        distinctUntilChanged((prev, curr) => {
          // Exclude selectedTaskCode
          const { selectedTask: prevTask, ...prevRest } = prev;
          const { selectedTask: currTask, ...currRest } = curr;
          return JSON.stringify(prevRest) === JSON.stringify(currRest);
        }),
      )
      .subscribe((params) => {
        if (!params['project']) this.filterForm.get('project')?.reset();
        this.resetAndFetchTasks(this.buildFilter());
      });
  }

  private buildFilter() {
    const { query, status, task, project, period, linguist } =
      this.filterForm.value;
    const filters = { query } as TasksFilterDto;
    filters.query = query;
    filters.status = status?.code;
    filters.task = task?.code;
    filters.projectCode = project?.code;
    filters.linguistId = linguist?.id;
    const [start, end] = period ?? [];
    filters.from = start
      ? (DayjsHelper.new(start)
          .add(1, 'hour')
          .format('YYYY-MM-DD') as unknown as Date)
      : null;
    filters.to = end
      ? (DayjsHelper.new(end)
          .add(1, 'hour')
          .format('YYYY-MM-DD') as unknown as Date)
      : null;

    return filters;
  }

  private updateUrlParams(filters: Nullable<TasksFilterDto>): void {
    const queryParams: Params = {
      query: filters?.query || null,
      status: filters?.status || null,
      task: filters?.task || null,
      project: filters?.projectCode || null,
      from: filters?.from || null,
      to: filters?.to || null,
      linguist: filters?.linguistId || null,
    };

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private loadProjectByCode(code?: string): void {
    this.projectService
      .findOne({ poId: code }, { error: { onError: false } })
      .pipe(
        finalize(() => (this.isFormInitialized = true)),
        finalize(() => this.resetAndFetchTasks(this.buildFilter())),
      )
      .subscribe({
        next: (project) => {
          if (!project) {
            this.router.navigate([], {
              queryParams: { project: null },
              queryParamsHandling: 'merge',
            });
            return;
          }
          this.filterForm.patchValue({
            project: { id: project.id, code: project.poId, name: project.poId },
          });
        },
        error: () => {
          this.filterForm.patchValue({
            project: { id: null, code: null, name: null },
          });
          this.router.navigate([], {
            queryParams: { client: null },
            queryParamsHandling: 'merge',
          });
        },
      });
  }

  clearFilters(): void {
    this.filterForm.reset();

    this.router.navigate([], {
      queryParams: {},
      queryParamsHandling: 'merge',
    });
  }
}
