import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { BaseClientDto } from '@TaskM/core/dto';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormInputErrorComponent } from '@TaskM/shared/ui';
import { ClientService } from '@TaskM/clients/data-access';
import { Currency } from '@TaskM/core/constants';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-client-autocomplete',
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
    CalendarModule,
  ],
  template: `
    <ng-container [formGroup]="form()">
      <ng-container formGroupName="client">
        @if (floatLabel()) {
          <p-floatLabel>
            <p-autoComplete
              formControlName="name"
              [suggestions]="filteredClients"
              (completeMethod)="searchClients($event)"
              field="name"
              [dropdown]="dropdown()"
              (onSelect)="onClientSelect($event)"
              [forceSelection]="true"
              [showClear]="showClear()"
              placeholder="Client"
              [inputId]="inputId()"
              class="w-full"
            ></p-autoComplete>
            <label [for]="inputId()">{{ label() }}</label>
          </p-floatLabel>
        } @else {
          <p-autoComplete
            formControlName="name"
            [suggestions]="filteredClients"
            (completeMethod)="searchClients($event)"
            field="name"
            [dropdown]="dropdown()"
            (onSelect)="onClientSelect($event)"
            [forceSelection]="true"
            [showClear]="showClear()"
            placeholder="Client"
            [inputId]="inputId()"
            class="w-full"
          ></p-autoComplete>
          <label [for]="inputId()">{{ label() }}</label>
        }
      </ng-container>
    </ng-container>
  `,
})
export class ClientAutocompleteComponent {
  form = input.required<FormGroup>();
  client = input<BaseClientDto | null>(null);
  inputId = input<string>('');
  floatLabel = input<boolean>(false);
  label = input<string>('');
  dropdown = input<boolean>(false);
  showClear = input<boolean>(false);
  selectClient = output<BaseClientDto | null>();
  loading = false;
  filteredClients: { name: string; value: string; currency: Currency }[] = [];
  searchQuery = '';
  page = 1;
  limit = 15;

  constructor(private clientService: ClientService) {}

  searchClients(event: AutoCompleteCompleteEvent) {
    this.searchQuery = event.query;
    this.page = 1; // Reset to first page on new search
    this.loadClients();
  }

  loadClients() {
    this.clientService
      .getList(
        { page: this.page, limit: this.limit, query: this.searchQuery },
        {
          error: { message: 'Failed to load clients' },
          success: { onSuccess: false },
        },
      )
      .pipe(
        map((data) =>
          data.items.map((client) => ({
            name: client.name,
            value: client.id,
            currency: client.currency,
            code: client.code,
          })),
        ),
      )
      .subscribe((response) => {
        this.filteredClients = response;
      });
  }

  onClientSelect(event: AutoCompleteSelectEvent) {
    this.form().patchValue({
      client: {
        id: event.value.value,
        name: event.value.name,
        code: event.value.code,
      },
    });
    this.selectClient.emit(
      event.value
        ? {
            id: event.value.value,
            name: event.value?.name,
            code: event.value?.code,
            currency: event.value?.currency,
          }
        : null,
    );
  }
}
