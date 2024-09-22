import { Component, OnInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Form,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BaseProjectDto } from '@TaskM/core/dto';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormInputErrorComponent } from '@TaskM/shared/ui';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-status-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule,
    InputNumberModule,
    FormInputErrorComponent,
    TagModule,
  ],
  template: `
    <ng-container [formGroup]="form()">
      @if (floatLabel()) {
        <p-floatLabel>
          <p-dropdown
            [formControlName]="formControlName()"
            [options]="options()"
            optionLabel="name"
            [showClear]="true"
            [placeholder]="placeholder()"
          >
            @if (selectedOption) {
              <ng-template pTemplate="selectedItem">
                <div class="flex align-items-center gap-2">
                  <p-tag [value]="selectedOption"></p-tag>
                </div>
              </ng-template>
            }
          </p-dropdown>
        </p-floatLabel>
      } @else {
        <p-dropdown
          [formControlName]="formControlName()"
          [options]="options()"
          optionLabel="name"
          [showClear]="true"
          [placeholder]="placeholder()"
        >
          @if (selectedOption) {
            <ng-template pTemplate="selectedItem">
              <div class="flex align-items-center gap-2">
                <p-tag [value]="selectedOption"></p-tag>
              </div>
            </ng-template>
          }
        </p-dropdown>
        <label [for]="inputId()">{{ label() }}</label>
      }
    </ng-container>
  `,
})
export class StatusDropdownComponent implements OnInit {
  form = input.required<FormGroup>();
  formControlName = input.required<string>();
  inputId = input<string>('');
  placeholder = input<string>('');
  floatLabel = input<boolean>(false);
  label = input<string>('');
  dropdown = input<boolean>(false);
  showClear = input<boolean>(false);
  selectProject = output<Partial<BaseProjectDto> | null>();
  options = input<any[]>([]);
  loading = false;
  selectedOption: any | undefined;

  ngOnInit() {
    console.log(this.options());
  }
}
