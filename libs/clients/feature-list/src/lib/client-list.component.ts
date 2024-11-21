import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '@TaskM/shared/layout';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixCross2 } from '@ng-icons/radix-icons';
import {
  InputSearchComponent,
  ListItemComponent,
  NoDataComponent,
  SpinnerComponent,
} from '@TaskM/shared/ui';
import { Client, ClientService } from '@TaskM/clients/data-access';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
} from 'rxjs';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientPreviewDto, ClientsFilterDto } from '@TaskM/core/dto';
import { ClientPreviewComponent } from '@TaskM/clients/feature-details';
import { ClientFormComponent } from '@TaskM/clients/form';
import { SkeletonModule } from 'primeng/skeleton';
import { FormUtilsService, ScrollNearEndDirective } from '@TaskM/shared/misc';
import { PAGINATION } from '@TaskM/core/constants';
import { Nullable } from '@TaskM/core/types';

type UrlParams = ClientsFilterDto & {
  selectedClientCode: string | null;
};
@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgIconComponent,
    SectionHeaderComponent,
    ButtonModule,
    InputTextModule,
    InputSearchComponent,
    ListItemComponent,
    ClientPreviewComponent,
    DialogModule,
    ClientFormComponent,
    SkeletonModule,
    SpinnerComponent,
    ScrollNearEndDirective,
    NoDataComponent,
  ],
  providers: [DialogService, provideIcons({ radixCross2 })],
  templateUrl: './client-list.component.html',
  host: { class: 'h-full py-1' },
})
export class ClientListComponent implements OnInit, OnDestroy {
  loading = false;
  isLoadingMore = false;
  private page = PAGINATION.DEFAULT_PAGE;
  private limit = PAGINATION.DEFAULT_LIMIT;
  private hasMore = true;
  filterForm: FormGroup<{
    query: FormControl<string | null>;
  }>;
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSubject.asObservable();
  selectedClientCode: string | null = null;
  dialogRef?: DynamicDialogRef;
  isFilterActivated = false;
  private isFormInitialized = false;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    this.initializeFilterForm();
    this.subscribeToFilterChanges();
    this.subscribeToRouteParams();
    this.subscribeToProjectChanges();
  }

  showCreateDialog(): void {
    this.dialogRef = this.dialogService.open(ClientFormComponent, {
      header: 'New Client',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { autoSave: true },
    });
  }

  private resetAndFetchClients(filters?: Nullable<ClientsFilterDto>): void {
    this.page = PAGINATION.DEFAULT_PAGE;
    this.hasMore = false;
    this.clientsSubject.next([]);
    this.fetchClients(filters);
  }

  private handleClientUpdate(client: ClientPreviewDto): void {
    const currentClients = this.clientsSubject.getValue();
    const index = currentClients.findIndex((t) => t.id === client.id);

    if (index !== -1) {
      currentClients[index] = client;
    } else {
      currentClients.unshift(client);
    }

    this.clientsSubject.next(currentClients);
  }

  private fetchClients(filters?: Nullable<ClientsFilterDto>): void {
    if (this.loading || (this.isLoadingMore && !this.hasMore)) return;

    this.setLoadingState(this.isInitialLoad(), !this.isInitialLoad());

    this.clientService
      .getList({
        ...filters,
        query: filters?.query ?? '',
        page: this.page,
        limit: this.limit,
      })
      .pipe(finalize(() => this.setLoadingState(false, false)))
      .subscribe((data) => {
        const currentClients = this.clientsSubject.getValue();
        this.clientsSubject.next(
          this.isInitialLoad()
            ? data.items
            : [...currentClients, ...data.items],
        );

        this.hasMore = this.page < data.meta.totalPages;
        if (this.hasMore) this.page++;
      });
  }

  private setLoadingState(loading: boolean, isLoadingMore: boolean): void {
    this.loading = loading;
    this.isLoadingMore = isLoadingMore;
  }

  onCloseChild(): void {
    this.selectedClientCode = null;
    this.selectClient(null);
  }

  selectClient(clientCode: string | null): void {
    this.router.navigate([], {
      queryParams: { selectedClient: clientCode },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
  }

  onNearEndScroll(): void {
    if (!this.isLoadingMore && this.hasMore) {
      this.setLoadingState(false, true);
      this.fetchClients(this.filterForm.getRawValue());
    }
  }

  private isInitialLoad(): boolean {
    return this.page === PAGINATION.DEFAULT_PAGE;
  }

  private subscribeToFilterChanges(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(() => this.isFormInitialized),
      )
      .subscribe(() => {
        this.isFilterActivated = this.formUtils.isAnyFilterActivated(
          this.filterForm,
        );
        this.updateUrlParams(this.buildFilter());
      });
  }

  private subscribeToProjectChanges(): void {
    this.clientService.getChanges().subscribe((client) => {
      if (client) this.handleClientUpdate(client);
    });
  }

  private subscribeToRouteParams(): void {
    this.route.queryParams
      .pipe(
        distinctUntilChanged(
          (prev, curr) => prev['selectedClient'] === curr['selectedClient'],
        ),
      )
      .subscribe((params) => {
        this.selectedClientCode = params['selectedClient'] ?? null;
      });

    // Subscriber for other route params
    this.route.queryParams
      .pipe(
        filter(() => this.isFormInitialized),
        distinctUntilChanged((prev, curr) => {
          const { selectedClient: prevClient, ...prevRest } = prev;
          const { selectedClient: currClient, ...currRest } = curr;
          return JSON.stringify(prevRest) === JSON.stringify(currRest);
        }),
      )
      .subscribe(() => {
        this.resetAndFetchClients(this.buildFilter());
      });
  }

  private buildFilter() {
    const { query } = this.filterForm.value;
    const filters = { query } as ClientsFilterDto;
    filters.query = query;

    return filters;
  }

  private updateUrlParams(filters: Nullable<ClientsFilterDto>): void {
    const queryParams: Params = {
      query: filters?.query ?? null,
    };

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private initializeFilterForm(): void {
    const params = this.route.snapshot.queryParams as UrlParams;

    this.filterForm = new FormGroup({
      query: new FormControl<string | null>(params?.query ?? null),
    });

    this.isFormInitialized = true;
    this.resetAndFetchClients(this.buildFilter());
  }
}
