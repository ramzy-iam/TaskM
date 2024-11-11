import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '@TaskM/shared/layout';
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
  of,
  switchMap,
} from 'rxjs';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProjectPreviewDto, ProjectsFilterDto } from '@TaskM/core/dto';
import { SkeletonModule } from 'primeng/skeleton';
import {
  BaseEnumComponent,
  FormUtilsService,
  ScrollNearEndDirective,
} from '@TaskM/shared/misc';
import {
  CustomTagSeverity,
  PAGINATION,
  ProjectStatus,
  ProjectStatusCode,
  ProjectTagSeverity,
  TaskStatus,
  TaskStatusCode,
  TaskTagSeverity,
} from '@TaskM/core/constants';
import { Nullable } from '@TaskM/core/types';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ClientAutocompleteComponent } from '@TaskM/clients/form';
import { CalendarModule } from 'primeng/calendar';
import { DayjsHelper } from '@TaskM/core/helpers';
import { ClientService } from '@TaskM/clients/data-access';
import { Task, TaskService } from '@TaskM/tasks/data-access';

type UrlParams = ProjectsFilterDto & {
  selectedProject: string | null;
  client?: string;
};

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SectionHeaderComponent,
    ButtonModule,
    InputTextModule,
    SkeletonModule,
    ScrollNearEndDirective,
    NoDataComponent,
    TagComponent,
    MultiSelectModule,
    DropdownModule,
    ClientAutocompleteComponent,
    CalendarModule,
  ],
  templateUrl: './home-dashboard.component.html',
  host: { class: 'h-full py-1' },
})
export class HomeDashboardComponent
  extends BaseEnumComponent
  implements OnInit
{
  loading = false;
  isLoadingMore = false;
  private page = PAGINATION.DEFAULT_PAGE;
  private limit = PAGINATION.DEFAULT_LIMIT;
  private hasMore = true;
  filterForm!: FormGroup<{
    status: FormControl<{
      code: ProjectStatusCode | null;
      name: string | null;
    } | null>;
    client: FormGroup<{
      id: FormControl<string | null | undefined>;
      code: FormControl<string | null | undefined>;
      name: FormControl<string | null | undefined>;
    }>;
    period: FormControl<(Date | null)[] | null | undefined>;
  }>;
  projects$ = new BehaviorSubject<Project[]>([]);
  selectedProjectCode: string | null = null;
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
  projectsForm: FormGroup;

  private isFormInitialized = false;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private formUtils: FormUtilsService,
    private clientService: ClientService,
    private fb: FormBuilder,
  ) {
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
    this.subscribeToProjectChanges();
  }

  private resetAndFetchProjects(filters?: Nullable<ProjectsFilterDto>): void {
    this.page = PAGINATION.DEFAULT_PAGE;
    this.hasMore = true;
    this.projects$.next([]);
    this.fetchProjects(filters);
  }

  getProjectTagSeverity(statusCode: string): CustomTagSeverity {
    return this.projectTagSeverity[
      statusCode as keyof typeof this.projectTagSeverity
    ];
  }

  getTaskTagSeverity(statusCode: string): CustomTagSeverity {
    return this.taskTagSeverity[
      statusCode as keyof typeof this.taskTagSeverity
    ];
  }

  private subscribeToProjectChanges(): void {
    this.projectService.getChanges().subscribe((project) => {
      if (project) {
        this.handleProjectUpdate(project);
      }
    });
  }

  private handleProjectUpdate(project: ProjectPreviewDto): void {
    const currentProjects = this.projects$.getValue();
    const index = currentProjects.findIndex((t) => t.id === project.id);

    if (index !== -1) {
      currentProjects[index] = project;
    } else {
      currentProjects.unshift(project);
    }

    this.projects$.next(currentProjects);
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
        withTasks: true,
        minNumberOfTasks: 1,
      })
      .pipe(finalize(() => this.setLoadingState(false, false)))
      .subscribe((data) => {
        const currentProjects = this.projects$.getValue();
        const newProjects = data.items;

        if (!this.projectsForm) {
          this.projectsForm = this.fb.group({});
        }

        newProjects.forEach((project) => {
          const existingProjectIndex = currentProjects.findIndex(
            (existingProject) => existingProject.id === project.id,
          );

          if (existingProjectIndex === -1) {
            this.addProjectControl(project);
            this.subscribeToProjectStatusChange(project.id);
          }

          project.tasks?.forEach((task) => {
            if (!this.getTaskControlById(task.id)) {
              this.addTaskControl(task);
              this.subscribeToTaskStatusChange(task.id);
            }
          });
        });
        const projects = this.isInitialLoad()
          ? (data.items ?? [...newProjects])
          : [...currentProjects, ...newProjects];

        this.projects$.next(projects);
        this.hasMore = this.page < data.meta.totalPages;
        if (this.hasMore) this.page++;
      });
  }

  private addProjectControl(project: Project): void {
    const projectControl = new FormControl(project.status);
    this.projectsForm.addControl(`project-${project.id}`, projectControl);
  }

  private addTaskControl(task: Task): void {
    const taskControl = new FormControl(task.status);
    this.projectsForm.addControl(`task-${task.id}`, taskControl);
  }

  private getTaskControlById(taskId: string): FormControl | null {
    const controls = Object.keys(this.projectsForm.controls);
    for (const controlKey of controls) {
      if (controlKey.includes(`task-${taskId}`)) {
        return this.projectsForm.get(controlKey) as FormControl;
      }
    }
    return null;
  }

  subscribeToProjectStatusChange(projectId: string) {
    const control = this.projectsForm.get(`project-${projectId}`);
    if (control) {
      control.valueChanges
        .pipe(
          debounceTime(300), // Debounce time to limit rapid calls
          switchMap((status: ProjectStatusCode) =>
            this.projectService.update(projectId, { status }).pipe(
              switchMap((updatedProject) =>
                this.projectService
                  .findOne({ poId: updatedProject.poId, withTasks: true })
                  .pipe(
                    switchMap((project) => {
                      this.projectService.triggerChanges(project as Project);
                      return of(project);
                    }),
                  ),
              ),
            ),
          ),
        )
        .subscribe();
    }
  }

  subscribeToTaskStatusChange(taskId: string) {
    const control = this.projectsForm.get(`task-${taskId}`);
    if (control) {
      control.valueChanges
        .pipe(
          debounceTime(300), // Debounce time to limit rapid calls
          switchMap((status: TaskStatusCode) =>
            this.taskService.update(taskId, { status }).pipe(
              switchMap((updatedTask) =>
                this.projectService
                  .findOne({ poId: updatedTask.project.poId, withTasks: true })
                  .pipe(
                    switchMap((project) => {
                      this.projectService.triggerChanges(project as Project);
                      return of(project); // Ensure the observable chain continues
                    }),
                  ),
              ),
            ),
          ),
        )
        .subscribe();
    }
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
      status: new FormControl<{
        code: ProjectStatusCode | null;
        name: string | null;
      } | null>({
        code: params?.status ?? null,
        name: ProjectStatus[params?.status as ProjectStatusCode] ?? null,
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
    const { status, client, period } = this.filterForm.value;
    const filters = {} as ProjectsFilterDto;
    filters.status = status?.code;
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
      status: filters?.status ?? null,
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

  onTaskStatusChange(event: DropdownChangeEvent, project: Project, task: Task) {
    task.statusLabel = TaskStatus[event.value as keyof typeof TaskStatus];
    task.status = event.value as TaskStatusCode;
  }

  onProjectStatusChange(event: DropdownChangeEvent, project: Project) {
    project.statusLabel =
      ProjectStatus[event.value as keyof typeof ProjectStatus];
    project.status = event.value as ProjectStatusCode;
  }
}
