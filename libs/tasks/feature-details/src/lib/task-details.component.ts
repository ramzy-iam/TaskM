import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '@TaskM/tasks/data-access';
import { BehaviorSubject, finalize, map } from 'rxjs';
import { TaskDto } from '@TaskM/core/dto';
import { TaskFormComponent } from '@TaskM/tasks/form';
import { SkeletonModule } from 'primeng/skeleton';
import {
  CloseButtonComponent,
  FormInputErrorComponent,
  SpinnerComponent,
  TagComponent,
} from '@TaskM/shared/ui';
import { Router, RouterModule } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClipboardDirective, FormUtilsService } from '@TaskM/shared/misc';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { ProjectAutocompleteComponent } from '@TaskM/projects/form';
import { ServiceProviderAutocompleteComponent } from '@TaskM/service-providers/form';
import { ProjectService } from '@TaskM/projects/data-access';
import { CompetenceService } from '@TaskM/service-providers/data-access';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    RouterModule,
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
    ProjectAutocompleteComponent,
    ServiceProviderAutocompleteComponent,
    ClipboardDirective,
    PanelModule,
    SpinnerComponent,
    TagComponent,
    TooltipModule,
  ],
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent
  extends TaskFormComponent
  implements OnInit, OnChanges
{
  @Input() code!: string;
  task$ = new BehaviorSubject<TaskDto | null>(null);
  override loading = false;

  constructor(
    protected override taskService: TaskService,
    @Optional() protected override dialogRef: DynamicDialogRef,
    protected override formUtils: FormUtilsService,
    private router: Router,
    protected override projectService: ProjectService,
    protected override competenceService: CompetenceService,
  ) {
    super(taskService, dialogRef, formUtils, projectService, competenceService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] && this.code) {
      this.fetchTask(this.code);
    }
  }

  fetchTask(code: string): void {
    this.loading = true;
    this.taskService
      .findOne({ code: code })
      .pipe(
        finalize(() => (this.loading = false)),
        map(
          (task) =>
            ({
              ...task,
              project: { ...task?.project, name: task?.project?.poId },
            }) as TaskDto,
        ),
      )
      .subscribe({
        next: (task) => {
          if (!task) this.close();
          this.task$.next(task);
          this.task = task;
          this.initializeForm(task, { project: !!task, rate: true });
          this.subscribeToTaskChanges();
        },
        error: () => {
          this.close();
        },
      });
  }

  close(): void {
    this.router.navigate([], {
      queryParams: { selectedTask: null },
      queryParamsHandling: 'merge',
    });
  }
}
