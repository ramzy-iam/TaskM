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
import { Project, ProjectService } from '@TaskM/projects/data-access';
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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProjectPreviewDto, ProjectsFilterDto } from '@TaskM/core/dto';
import { ProjectPreviewComponent } from '@TaskM/projects/feature-details';
import { ProjectFormComponent } from '@TaskM/projects/form';
import { SkeletonModule } from 'primeng/skeleton';
import { FormUtilsService, ScrollNearEndDirective } from '@TaskM/shared/misc';
import {
  PAGINATION,
  ProjectStatus,
  ProjectStatusCode,
  ProjectTagSeverity,
  TaskType,
  TaskTypeCode,
} from '@TaskM/core/constants';
import { Nullable } from '@TaskM/core/types';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ClientAutocompleteComponent } from '@TaskM/clients/form';
import { CalendarModule } from 'primeng/calendar';
import { DayjsHelper } from '@TaskM/core/helpers';
import { ClientService } from '@TaskM/clients/data-access';

type UrlParams = ProjectsFilterDto & {
  selectedProject: string | null;
  client?: string;
};

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    ReactiveFormsModule,
    NgIconComponent,
    SectionHeaderComponent,
    ButtonModule,
    InputTextModule,
    InputSearchComponent,
    ListItemComponent,
    ProjectPreviewComponent,
    DialogModule,
    SkeletonModule,
    SpinnerComponent,
    ScrollNearEndDirective,
    NoDataComponent,
    TagComponent,
    MultiSelectModule,
    DropdownModule,
    ClientAutocompleteComponent,
    CalendarModule,
  ],
  providers: [DialogService, provideIcons({ radixCross2 })],
  templateUrl: './project-list.component.html',
  host: { class: 'h-full py-1' },
})
export class ProjectListComponent implements OnInit, OnDestroy {
  loading = false;
  isLoadingMore = false;
  private page = PAGINATION.DEFAULT_PAGE;
  private limit = PAGINATION.DEFAULT_LIMIT;
  private hasMore = true;
  filterForm!: FormGroup<{
    query: FormControl<string | null>;
    status: FormControl<{
      code: ProjectStatusCode | null;
      name: string | null;
    } | null>;
    task: FormControl<{
      code: TaskTypeCode | null;
      name: string | null;
    } | null>;
    client: FormGroup<{
      id: FormControl<string | null | undefined>;
      code: FormControl<string | null | undefined>;
      name: FormControl<string | null | undefined>;
    }>;
    period: FormControl<(Date | null)[] | null | undefined>;
  }>;
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  projects$ = this.projectsSubject.asObservable();
  selectedProjectCode: string | null = null;
  dialogRef?: DynamicDialogRef;
  isFilterActivated = false;
  projectTagSeverity = ProjectTagSeverity;
  projectStatus = Object.keys(ProjectStatus).map((key) => ({
    code: key,
    name: ProjectStatus[key as keyof typeof ProjectStatusCode],
  }));

  taskTypes = Object.entries(TaskType).map(([key, value]) => ({
    code: key,
    name: value,
  }));

  private isFormInitialized = false;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private formUtils: FormUtilsService,
    private clientService: ClientService,
  ) {}

  ngOnInit(): void {
    this.initializeFilterForm();
    this.subscribeToFilterChanges();
    this.subscribeToRouteParams();
    this.subscribeToProjectChanges();
  }

  showCreateDialog(): void {
    this.dialogRef = this.dialogService.open(ProjectFormComponent, {
      header: 'New Project',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { autoSave: true },
    });
  }

  private resetAndFetchProjects(filters?: Nullable<ProjectsFilterDto>): void {
    this.page = PAGINATION.DEFAULT_PAGE;
    this.hasMore = true;
    this.projectsSubject.next([]);
    this.fetchProjects(filters);
  }

  private subscribeToProjectChanges(): void {
    this.projectService.getChanges().subscribe((project) => {
      if (project) {
        this.handleProjectUpdate(project);
      }
    });
  }

  private handleProjectUpdate(project: ProjectPreviewDto): void {
    const currentProjects = this.projectsSubject.getValue();
    const index = currentProjects.findIndex((t) => t.id === project.id);

    if (index !== -1) {
      currentProjects[index] = project;
    } else {
      currentProjects.unshift(project);
    }

    this.projectsSubject.next(currentProjects);
  }

  private fetchProjects(filters?: Nullable<ProjectsFilterDto>): void {
    if (this.loading || (this.isLoadingMore && !this.hasMore)) return;

    this.setLoadingState(this.isInitialLoad(), !this.isInitialLoad());

    this.projectService
      .getList({
        ...filters,
        query: filters?.query,
        page: this.page,
        limit: this.limit,
      })
      .pipe(finalize(() => this.setLoadingState(false, false)))
      .subscribe((data) => {
        const currentProjects = this.projectsSubject.getValue();
        this.projectsSubject.next(
          this.isInitialLoad()
            ? data.items
            : [...currentProjects, ...data.items],
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
    this.selectedProjectCode = null;
    this.selectProject(null);
  }

  selectProject(projectCode: string | null): void {
    this.router.navigate([], {
      queryParams: { selectedProject: projectCode },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }

  onNearEndScroll(): void {
    if (!this.isLoadingMore && this.hasMore) {
      this.setLoadingState(false, true);
      this.fetchProjects(this.buildFilter());
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
        code: ProjectStatusCode | null;
        name: string | null;
      } | null>({
        code: params?.status ?? null,
        name: ProjectStatus[params?.status as ProjectStatusCode] ?? null,
      }),
      task: new FormControl<{
        code: TaskTypeCode | null;
        name: string | null;
      } | null>({
        code: params?.task ?? null,
        name: TaskType[params.task!] ?? null,
      }),
      client: this.formUtils.createMinimalClientForm(null, {}),
      period: new FormControl<(Date | null)[] | null | undefined>(
        this.getPeriodFromParams(params),
      ),
    });

    if (params?.client) {
      this.loadClientByCode(params?.client);
    } else {
      this.isFormInitialized = true;
      this.resetAndFetchProjects(this.buildFilter());
      this.router.navigate([], {
        queryParams: { client: null },
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
    // Subscriber for selectedProjectCode
    this.route.queryParams
      .pipe(
        distinctUntilChanged(
          (prev, curr) => prev['selectedProject'] === curr['selectedProject'],
        ),
      )
      .subscribe((params) => {
        this.selectedProjectCode = params['selectedProject'] ?? null;
      });

    // Subscriber for other route params
    this.route.queryParams
      .pipe(
        filter(() => this.isFormInitialized),
        distinctUntilChanged((prev, curr) => {
          // Exclude selectedProjectCode
          const { selectedProject: prevProject, ...prevRest } = prev;
          const { selectedProject: currProject, ...currRest } = curr;
          return JSON.stringify(prevRest) === JSON.stringify(currRest);
        }),
      )
      .subscribe((params) => {
        if (!params['client']) this.filterForm.get('client')?.reset();
        this.resetAndFetchProjects(this.buildFilter());
      });
  }

  private buildFilter() {
    const { query, status, task, client, period } = this.filterForm.value;
    const filters = { query } as ProjectsFilterDto;
    filters.query = query;
    filters.status = status?.code;
    filters.task = task?.code;
    filters.clientCode = client?.code;
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

  private updateUrlParams(filters: Nullable<ProjectsFilterDto>): void {
    const queryParams: Params = {
      query: filters?.query || null,
      status: filters?.status || null,
      task: filters?.task || null,
      client: filters?.clientCode || null,
      from: filters?.from || null,
      to: filters?.to || null,
    };

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private loadClientByCode(code?: string): void {
    this.clientService
      .findOne({ code }, { error: { onError: false } })
      .pipe(
        finalize(() => (this.isFormInitialized = true)),
        finalize(() => this.resetAndFetchProjects(this.buildFilter())),
      )
      .subscribe({
        next: (client) => {
          if (!client) {
            this.router.navigate([], {
              queryParams: { client: null },
              queryParamsHandling: 'merge',
            });
            return;
          }
          this.filterForm.patchValue({
            client: { id: client.id, code: client.code, name: client.name },
          });
        },
        error: () => {
          this.filterForm.patchValue({
            client: { id: null, code: null, name: null },
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
