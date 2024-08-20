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
  ProjectTagSeverity,
} from '@TaskM/core/constants';
import { Nullable } from '@TaskM/core/types';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ClientAutocompleteComponent } from '@TaskM/clients/form';

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
  filterForm = new FormGroup({
    query: new FormControl<string | null>(null),
    selectedStatus: new FormControl<string | null>(null),
    client: this.formUtils.createMinimalClientForm(null),
  });
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  projects$ = this.projectsSubject.asObservable();
  selectedProjectCode: string | null = null;
  dialogRef?: DynamicDialogRef;
  isFilterActivated = false;
  projectTagSeverity = ProjectTagSeverity;
  projectStatus = Object.keys(ProjectStatus).map((key) => ({
    code: key,
    name: ProjectStatus[key as keyof typeof ProjectStatus],
  }));

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(({ ...filters }) => {
        this.isFilterActivated = this.formUtils.isAnyFilterActivated(
          this.filterForm,
        );
        this.resetAndFetchProjects(filters);
      });

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
      header: 'Create project',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { autoSave: true },
    });
  }

  private resetAndFetchProjects(filters?: Nullable<ProjectsFilterDto>): void {
    this.page = PAGINATION.DEFAULT_PAGE;
    this.hasMore = false;
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
        query: filters?.query ?? '',
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
      this.fetchProjects(this.filterForm.getRawValue());
    }
  }

  private isInitialLoad(): boolean {
    return this.page === PAGINATION.DEFAULT_PAGE;
  }

  private loadInitialProjects(): void {
    this.fetchProjects();
  }
}
