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
  finalize,
} from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProjectPreviewDto, ProjectsFilterDto } from '@TaskM/core/dto';
import { ProjectDetailsComponent } from '@TaskM/projects/feature-details';
import { ProjectFormComponent } from '@TaskM/projects/form';
import { SkeletonModule } from 'primeng/skeleton';
import { FormUtilsService, ScrollNearEndDirective } from '@TaskM/shared/misc';
import {
  PAGINATION,
  ProjectStatus,
  ProjectStatusCode,
  ProjectTagSeverity,
  TASK_TYPES_WITH_LABEL,
  TaskType,
} from '@TaskM/core/constants';
import { Nullable } from '@TaskM/core/types';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ClientAutocompleteComponent } from '@TaskM/clients/form';
import { CalendarModule } from 'primeng/calendar';
import { DayjsHelper } from '@TaskM/core/helpers';

@Component({
  selector: 'app-project-list',
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
    ProjectDetailsComponent,
    DialogModule,
    // ProjectFormComponent,
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
      code: ProjectStatusCode;
      name: string;
    } | null>;
    taskType: FormControl<{
      code: TaskType;
      name: string;
    } | null>;
    client: FormGroup<{
      id: FormControl<string | null | undefined>;
      code: FormControl<string | null | undefined>;
      name: FormControl<string | null | undefined>;
    }>;
    period: FormControl<Date[] | null | undefined>;
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

  taskTypes = TASK_TYPES_WITH_LABEL.map(({ value, name }) => ({
    code: value,
    name,
  }));

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    this.initFiltersForm();
    this.onFilterChanges();
    this.loadInitialProjects();

    this.projectService.getChanges().subscribe((project) => {
      if (project) this.handleProjectUpdate(project);
    });

    this.route.queryParams.subscribe((params) => {
      this.selectedProjectCode = params['selectedProject'] ?? null;
    });
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
    if (this.dialogRef) this.dialogRef.close();
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

  private loadInitialProjects(): void {
    this.fetchProjects();
  }

  private onFilterChanges() {
    this.filterForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.isFilterActivated = this.formUtils.isAnyFilterActivated(
          this.filterForm,
        );
        this.resetAndFetchProjects(this.buildFilter());
      });
  }

  private buildFilter() {
    const formValues = this.filterForm.getRawValue();
    const filters = {} as ProjectsFilterDto;
    filters.query = formValues.query;
    filters.status = formValues.status?.code;
    filters.taskType = formValues.taskType?.code;
    filters.clientCode = formValues?.client?.code;
    const [start, end] = formValues.period ?? [];
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

  private initFiltersForm() {
    this.filterForm = new FormGroup({
      query: new FormControl<string | null>(null),
      status: new FormControl<{ code: ProjectStatusCode; name: string } | null>(
        null,
      ),
      taskType: new FormControl<{ code: TaskType; name: string } | null>(null),
      client: this.formUtils.createMinimalClientForm(null),
      period: new FormControl<Date[] | null | undefined>(null),
    });
  }
}
