import {
  Component,
  Input,
  OnChanges,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '@TaskM/projects/data-access';
import { BehaviorSubject, finalize } from 'rxjs';
import { ProjectDto } from '@TaskM/core/dto';
import { ProjectFormComponent } from '@TaskM/projects/form';
import { SkeletonModule } from 'primeng/skeleton';
import {
  CloseButtonComponent,
  FormInputErrorComponent,
} from '@TaskM/shared/ui';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClipboardDirective, FormUtilsService } from '@TaskM/shared/misc';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ClientAutocompleteComponent } from '@TaskM/clients/form';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    CloseButtonComponent,
    FormsModule,
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
  ],
  templateUrl: './project-details.component.html',
})
export class ProjectDetailsComponent
  extends ProjectFormComponent
  implements OnChanges
{
  @Input() code!: string;
  project$ = new BehaviorSubject<ProjectDto | null>(null);
  override loading = false;

  constructor(
    protected override projectService: ProjectService,
    @Optional() protected override dialogRef: DynamicDialogRef,
    protected override formUtils: FormUtilsService,
    private router: Router,
  ) {
    super(projectService, dialogRef, formUtils);
  }

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
          this.initializeForm(project, { client: true });
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
