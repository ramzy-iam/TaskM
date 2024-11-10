import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { BaseServiceProviderDto } from '@TaskM/core/dto';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormInputErrorComponent } from '@TaskM/shared/ui';
import { ServiceProviderService } from '@TaskM/service-providers/data-access';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';

@Component({
  selector: 'app-service-provider-autocomplete',
  standalone: true,
  imports: [
    CommonModule,

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
      <ng-container formGroupName="serviceProvider">
        @if (floatLabel()) {
          <p-floatLabel>
            <p-autoComplete
              formControlName="name"
              [suggestions]="filteredServiceProviders"
              (completeMethod)="searchServiceProviders($event)"
              field="name"
              [dropdown]="dropdown()"
              (onSelect)="onServiceProviderSelect($event)"
              (onClear)="onServiceProviderUnselect()"
              [forceSelection]="true"
              [showClear]="showClear()"
              [placeholder]="placeholder()"
              [inputId]="inputId()"
              class="w-full"
            ></p-autoComplete>
            <label [for]="inputId()">{{ label() }}</label>
          </p-floatLabel>
        } @else {
          <p-autoComplete
            formControlName="name"
            [suggestions]="filteredServiceProviders"
            (completeMethod)="searchServiceProviders($event)"
            field="name"
            [dropdown]="dropdown()"
            (onSelect)="onServiceProviderSelect($event)"
            (onClear)="onServiceProviderUnselect()"
            [forceSelection]="true"
            [showClear]="showClear()"
            [placeholder]="placeholder()"
            [inputId]="inputId()"
            class="w-full"
          ></p-autoComplete>
          <label [for]="inputId()">{{ label() }}</label>
        }
      </ng-container>
    </ng-container>
  `,
})
export class ServiceProviderAutocompleteComponent {
  form = input.required<FormGroup>();
  serviceProvider = input<BaseServiceProviderDto | null>(null);
  inputId = input<string>('');
  floatLabel = input<boolean>(false);
  label = input<string>('');
  placeholder = input<string>('Service Provider');
  dropdown = input<boolean>(false);
  showClear = input<boolean>(false);
  selectServiceProvider = output<BaseServiceProviderDto | null>();
  loading = false;
  filteredServiceProviders: { name: string; value: string }[] = [];
  searchQuery = '';
  page = 1;
  limit = 15;

  constructor(private serviceProviderService: ServiceProviderService) {}

  searchServiceProviders(event: AutoCompleteCompleteEvent) {
    this.searchQuery = event.query;
    this.page = 1; // Reset to first page on new search
    this.loadServiceProviders();
  }

  loadServiceProviders() {
    this.serviceProviderService
      .getList(
        { page: this.page, limit: this.limit, query: this.searchQuery },
        {
          error: { message: 'Failed to load serviceProviders' },
          success: { onSuccess: false },
        },
      )
      .pipe(
        map((data) =>
          data.items.map((serviceProvider) => ({
            name: serviceProvider.fullName,
            value: serviceProvider.id,
            firstName: serviceProvider.firstName,
            lastName: serviceProvider.lastName,
            email: serviceProvider.email,
          })),
        ),
      )
      .subscribe((response) => {
        this.filteredServiceProviders = response;
      });
  }

  onServiceProviderSelect(event: AutoCompleteSelectEvent) {
    const fields = {
      id: event.value.value,
      name: event.value.name,
      code: event.value.code,
    };
    this.form().patchValue({
      serviceProvider: fields,
    });
    this.selectServiceProvider.emit(
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

  onServiceProviderUnselect() {
    const event = {
      value: {
        name: null,
        value: null,
        currency: null,
      },
    } as AutoCompleteSelectEvent;
    this.onServiceProviderSelect(event);
  }
}
