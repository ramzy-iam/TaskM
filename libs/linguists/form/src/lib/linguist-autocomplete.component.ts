import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { BaseLinguistDto } from '@TaskM/core/dto';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormInputErrorComponent } from '@TaskM/shared/ui';
import { LinguistService } from '@TaskM/linguists/data-access';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';

@Component({
  selector: 'app-linguist-autocomplete',
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
    AutoCompleteModule,
  ],
  template: `
    <ng-container [formGroup]="form()">
      <ng-container formGroupName="linguist">
        @if (floatLabel()) {
          <p-floatLabel>
            <p-autoComplete
              formControlName="name"
              [suggestions]="filteredLinguists"
              (completeMethod)="searchLinguists($event)"
              field="name"
              [dropdown]="dropdown()"
              (onSelect)="onLinguistSelect($event)"
              (onClear)="onLinguistUnselect()"
              [forceSelection]="true"
              [showClear]="showClear()"
              placeholder="Linguist"
              [inputId]="inputId()"
              class="w-full"
            ></p-autoComplete>
            <label [for]="inputId()">{{ label() }}</label>
          </p-floatLabel>
        } @else {
          <p-autoComplete
            formControlName="name"
            [suggestions]="filteredLinguists"
            (completeMethod)="searchLinguists($event)"
            field="name"
            [dropdown]="dropdown()"
            (onSelect)="onLinguistSelect($event)"
            (onClear)="onLinguistUnselect()"
            [forceSelection]="true"
            [showClear]="showClear()"
            placeholder="Linguist"
            [inputId]="inputId()"
            class="w-full"
          ></p-autoComplete>
          <label [for]="inputId()">{{ label() }}</label>
        }
      </ng-container>
    </ng-container>
  `,
})
export class LinguistAutocompleteComponent {
  form = input.required<FormGroup>();
  linguist = input<BaseLinguistDto | null>(null);
  inputId = input<string>('');
  floatLabel = input<boolean>(false);
  label = input<string>('');
  dropdown = input<boolean>(false);
  showClear = input<boolean>(false);
  selectLinguist = output<BaseLinguistDto | null>();
  loading = false;
  filteredLinguists: { name: string; value: string }[] = [];
  searchQuery = '';
  page = 1;
  limit = 15;

  constructor(private linguistService: LinguistService) {}

  searchLinguists(event: AutoCompleteCompleteEvent) {
    this.searchQuery = event.query;
    this.page = 1; // Reset to first page on new search
    this.loadLinguists();
  }

  loadLinguists() {
    this.linguistService
      .getList(
        { page: this.page, limit: this.limit, query: this.searchQuery },
        {
          error: { message: 'Failed to load linguists' },
          success: { onSuccess: false },
        },
      )
      .pipe(
        map((data) =>
          data.items.map((linguist) => ({
            name: linguist.fullName,
            value: linguist.id,
            firstName: linguist.firstName,
            lastName: linguist.lastName,
            email: linguist.email,
          })),
        ),
      )
      .subscribe((response) => {
        this.filteredLinguists = response;
      });
  }

  onLinguistSelect(event: AutoCompleteSelectEvent) {
    const fields = {
      id: event.value.value,
      name: event.value.name,
      code: event.value.code,
    };
    this.form().patchValue({
      linguist: fields,
    });
    this.selectLinguist.emit(
      event.value
        ? {
            id: event.value.value,
            fullName: event.value.name,
            firstName: event.value.firstName,
            lastName: event.value.lastName,
            email: event.value.email,
          }
        : null,
    );
  }

  onLinguistUnselect() {
    const event = {
      value: {
        name: null,
        value: null,
        currency: null,
      },
    } as AutoCompleteSelectEvent;
    this.onLinguistSelect(event);
  }
}
