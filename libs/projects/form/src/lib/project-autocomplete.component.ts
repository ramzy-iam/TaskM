import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { BaseProjectDto } from '@TaskM/core/dto';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormInputErrorComponent } from '@TaskM/shared/ui';
import { ProjectService } from '@TaskM/projects/data-access';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';

@Component({
  selector: 'app-project-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    InputNumberModule,
    FormInputErrorComponent,
    AutoCompleteModule,
  ],
  template: `
    <ng-container [formGroup]="form()">
      <ng-container formGroupName="project">
        @if (floatLabel()) {
          <p-floatLabel>
            <p-autoComplete
              formControlName="name"
              [suggestions]="filteredProjects"
              (completeMethod)="searchProjects($event)"
              field="name"
              [dropdown]="dropdown()"
              (onSelect)="onProjectSelect($event)"
              (onClear)="onProjectUnselect()"
              [forceSelection]="true"
              [showClear]="showClear()"
              placeholder="Project"
              [inputId]="inputId()"
              class="w-full"
            ></p-autoComplete>
            <label [for]="inputId()">{{ label() }}</label>
          </p-floatLabel>
        } @else {
          <p-autoComplete
            formControlName="name"
            [suggestions]="filteredProjects"
            (completeMethod)="searchProjects($event)"
            field="name"
            [dropdown]="dropdown()"
            (onSelect)="onProjectSelect($event)"
            (onClear)="onProjectUnselect()"
            [forceSelection]="true"
            [showClear]="showClear()"
            placeholder="Project"
            [inputId]="inputId()"
            class="w-full"
          ></p-autoComplete>
          <label [for]="inputId()">{{ label() }}</label>
        }
      </ng-container>
    </ng-container>
  `,
})
export class ProjectAutocompleteComponent {
  form = input.required<FormGroup>();
  project = input<BaseProjectDto | null>(null);
  inputId = input<string>('');
  floatLabel = input<boolean>(false);
  label = input<string>('');
  dropdown = input<boolean>(false);
  showClear = input<boolean>(false);
  selectProject = output<Partial<BaseProjectDto> | null>();
  loading = false;
  filteredProjects: { name: string; value: string; internalDeadline: Date }[] =
    [];
  searchQuery = '';
  page = 1;
  limit = 15;

  constructor(private projectService: ProjectService) {}

  searchProjects(event: AutoCompleteCompleteEvent) {
    this.searchQuery = event.query;
    this.page = 1; // Reset to first page on new search
    this.loadProjects();
  }

  loadProjects() {
    this.projectService
      .getList(
        { page: this.page, limit: this.limit, query: this.searchQuery },
        {
          error: { message: 'Failed to load projects' },
          success: { onSuccess: false },
        },
      )
      .pipe(
        map((data) =>
          data.items.map((project) => ({
            name: project.poId,
            code: project.poId,
            value: project.id,
            internalDeadline: project.internalDeadline,
            receivedAt: project.receivedAt,
          })),
        ),
      )
      .subscribe((response) => {
        this.filteredProjects = response;
      });
  }

  onProjectSelect(event: AutoCompleteSelectEvent) {
    const fields = {
      id: event.value.value,
      code: event.value.code,
      name: event.value.code,
    };
    this.form().patchValue({
      project: fields,
    });
    this.selectProject.emit(event.value ? fields : null);
  }

  onProjectUnselect() {
    const event = {
      value: {
        name: null,
        value: null,
        code: null,
        internalDeadline: null,
        receivedAt: null,
      },
    } as AutoCompleteSelectEvent;
    this.onProjectSelect(event);
  }
}
