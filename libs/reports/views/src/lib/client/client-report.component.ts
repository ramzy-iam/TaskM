import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NoDataComponent, TagComponent } from '@TaskM/shared/ui';
import { Project, ProjectService } from '@TaskM/projects/data-access';
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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectsFilterDto } from '@TaskM/core/dto';
import { SkeletonModule } from 'primeng/skeleton';
import {
  BaseEnumComponent,
  FormUtilsService,
  ScrollNearEndDirective,
} from '@TaskM/shared/misc';
import {
  PAGINATION,
  ProjectStatusCode,
  ProjectTagSeverity,
  TaskTagSeverity,
} from '@TaskM/core/constants';
import { Nullable } from '@TaskM/core/types';
import { MultiSelectModule } from 'primeng/multiselect';
import { ClientAutocompleteComponent } from '@TaskM/clients/form';
import { CalendarModule } from 'primeng/calendar';
import { DayjsHelper } from '@TaskM/core/helpers';
import { ClientService } from '@TaskM/clients/data-access';
import { ClientReportFormComponent } from './form/client-report-form.component';
import { ReportForm } from './form';

type UrlParams = ProjectsFilterDto & {
  selectedProject: string | null;
  client?: string;
};

@Component({
  selector: 'app-client-report',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SkeletonModule,
    ScrollNearEndDirective,
    NoDataComponent,
    TagComponent,
    MultiSelectModule,
    ClientAutocompleteComponent,
    CalendarModule,
    ClientReportFormComponent,
  ],
  templateUrl: './client-report.component.html',

  host: { class: 'h-full py-1' },
})
export class ClientReportComponent extends BaseEnumComponent implements OnInit {
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formUtils = inject(FormUtilsService);
  private clientService = inject(ClientService);

  loading = false;
  isLoadingMore = false;
  private page = PAGINATION.DEFAULT_PAGE;
  private limit = PAGINATION.DEFAULT_LIMIT;
  private hasMore = true;
  filterForm!: ReportForm;
  projects$ = new BehaviorSubject<Project[]>([]);
  isFilterActivated = false;
  projectTagSeverity = ProjectTagSeverity;
  taskTagSeverity = TaskTagSeverity;
  private excludedProjectStatuses = [
    ProjectStatusCode.NOT_STARTED,
    ProjectStatusCode.CANCELLED,
  ];
  filterProjectStatus: {
    code: string;
    name: string;
  }[] = [];

  private isFormInitialized = false;

  constructor() {
    super();
    this.filterProjectStatus = this.projectStatuses
      .filter(
        (status) =>
          !this.excludedProjectStatuses.includes(
            status.value as ProjectStatusCode,
          ),
      )
      .map((status) => ({
        code: status.value,
        name: status.name,
      }));
  }

  ngOnInit(): void {
    this.initializeFilterForm();
    this.subscribeToFilterChanges();
    this.subscribeToRouteParams();
  }

  private resetAndFetchProjects(filters?: Nullable<ProjectsFilterDto>): void {
    this.page = PAGINATION.DEFAULT_PAGE;
    this.hasMore = true;
    this.projects$.next([]);
    this.fetchProjects(filters);
  }

  fetchProjects(filters?: Nullable<ProjectsFilterDto>): void {
    if (this.loading || (this.isLoadingMore && !this.hasMore)) return;

    this.setLoadingState(this.isInitialLoad(), !this.isInitialLoad());

    this.projectService
      .getList({
        ...filters,
        query: filters?.query,
        page: this.page,
        limit: this.limit,
        withTasks: true,
        minNumberOfTasks: 1,
      })
      .pipe(finalize(() => this.setLoadingState(false, false)))
      .subscribe((data) => {
        const currentProjects = this.projects$.getValue();
        const newProjects = data.items;

        const projects = this.isInitialLoad()
          ? (data.items ?? [...newProjects])
          : [...currentProjects, ...newProjects];

        this.projects$.next(projects);
        this.hasMore = this.page < data.meta.totalPages;
        if (this.hasMore) this.page++;
      });
  }

  private setLoadingState(loading: boolean, isLoadingMore: boolean): void {
    this.loading = loading;
    this.isLoadingMore = isLoadingMore;
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
      client: this.formUtils.createMinimalClientForm(null, { required: true }),
      period: new FormControl<(Date | null)[] | null | undefined>(
        this.getPeriodFromParams(params),
        [Validators.required],
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
    this.route.queryParams
      .pipe(
        filter(() => this.isFormInitialized),
        distinctUntilChanged((prev, curr) => {
          return JSON.stringify(prev) === JSON.stringify(curr);
        }),
      )
      .subscribe(() => {
        this.resetAndFetchProjects(this.buildFilter());
      });
  }

  private buildFilter() {
    const { client, period } = this.filterForm.value;
    const filters = {} as ProjectsFilterDto;
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
      client: filters?.clientCode ?? null,
      from: filters?.from ?? null,
      to: filters?.to ?? null,
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
