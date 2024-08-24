import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '@TaskM/projects/data-access';
import { BehaviorSubject, finalize } from 'rxjs';
import { ProjectDto } from '@TaskM/core/dto';
import { ProjectFormComponent } from '@TaskM/projects/form';
import { SkeletonModule } from 'primeng/skeleton';
import { CloseButtonComponent } from '@TaskM/shared/ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    ProjectFormComponent,
    SkeletonModule,
    CloseButtonComponent,
  ],
  templateUrl: './project-details.component.html',
})
export class ProjectDetailsComponent implements OnChanges {
  @Input() code!: string;
  project$ = new BehaviorSubject<ProjectDto | null>(null);
  loading = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] && this.code) {
      this.fetchProject(this.code);
    }
  }

  fetchProject(poId: string): void {
    this.loading = true;
    this.projectService
      .findOne({ poId: poId })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (project) => {
          if (!project) this.close();

          this.project$.next(project);
        },
        error: () => {
          this.close();
        },
      });
  }

  close(): void {
    this.router.navigate([], {
      queryParams: { selectedProject: null },
      queryParamsHandling: 'merge',
    });
  }
}
