import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, finalize } from 'rxjs';
import { ProjectDto } from '@TaskM/core/dto';
import { ProjectFormComponent } from '@TaskM/projects/form';
import { SkeletonModule } from 'primeng/skeleton';
import {
  CloseButtonComponent,
  FormInputErrorComponent,
  TagComponent,
} from '@TaskM/shared/ui';
import { Router } from '@angular/router';
import { ClipboardDirective } from '@TaskM/shared/misc';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ClientAutocompleteComponent } from '@TaskM/clients/form';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-project-preview',
  imports: [
    CommonModule,
    SkeletonModule,
    CloseButtonComponent,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule,
    InputNumberModule,
    FormInputErrorComponent,
    CalendarModule,
    ClientAutocompleteComponent,
    ClipboardDirective,
    PanelModule,
    TagComponent,
  ],
  templateUrl: './project-preview.component.html',
})
export class ProjectPreviewComponent
  extends ProjectFormComponent
  implements OnInit, OnChanges
{
  private readonly router = inject(Router);

  readonly code = input.required<string>();
  project$ = new BehaviorSubject<ProjectDto | null>(null);

  override ngOnInit(): void {
    this.triggerAutoSave(true);
    this.subscribeToStatusChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const code = this.code();
    if (changes['code'] && code) {
      this.fetchProject(code);
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
          this.project = project;
          this.initializeForm(project, { client: true });
          this.triggerAutoSave(true);
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
