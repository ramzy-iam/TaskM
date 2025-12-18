import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ClipboardDirective } from '@TaskM/shared/misc';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { ProjectAutocompleteComponent } from '@TaskM/projects/form';
import { ServiceProviderAutocompleteComponent } from '@TaskM/service-providers/form';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-task-preview',
  imports: [
    CommonModule,
    SkeletonModule,
    RouterModule,
    CloseButtonComponent,
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
  templateUrl: './task-preview.component.html',
})
export class TaskPreviewComponent
  extends TaskFormComponent
  implements OnInit, OnChanges
{
  private router = inject(Router);

  readonly code = input.required<string>();
  task$ = new BehaviorSubject<TaskDto | null>(null);
  override loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    const code = this.code();
    if (changes['code'] && code) {
      this.fetchTask(code);
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
