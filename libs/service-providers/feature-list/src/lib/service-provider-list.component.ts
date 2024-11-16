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
import {
  ServiceProvider,
  ServiceProviderService,
} from '@TaskM/service-providers/data-access';
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
import {
  ServiceProviderPreviewDto,
  ServiceProvidersFilterDto,
} from '@TaskM/core/dto';
import { ServiceProviderDetailsComponent } from '@TaskM/service-providers/feature-details';
import { ServiceProviderFormComponent } from '@TaskM/service-providers/form';
import { SkeletonModule } from 'primeng/skeleton';
import { FormUtilsService, ScrollNearEndDirective } from '@TaskM/shared/misc';
import { PAGINATION, TaskType, TaskTypeCode } from '@TaskM/core/constants';
import { Nullable } from '@TaskM/core/types';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TooltipModule } from 'primeng/tooltip';

type UrlParams = ServiceProvidersFilterDto & {
  selectedServiceProvider: string | null;
  competence: TaskTypeCode | null;
};
@Component({
  selector: 'app-service-provider-list',
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
    ServiceProviderDetailsComponent,
    DialogModule,
    ServiceProviderFormComponent,
    SkeletonModule,
    SpinnerComponent,
    ScrollNearEndDirective,
    NoDataComponent,
    DropdownModule,
    AvatarModule,
    AvatarGroupModule,
    TooltipModule,
  ],
  providers: [DialogService, provideIcons({ radixCross2 })],
  templateUrl: './service-provider-list.component.html',
  host: { class: 'h-full py-1' },
})
export class ServiceProviderListComponent implements OnInit, OnDestroy {
  loading = false;
  isLoadingMore = false;
  private page = PAGINATION.DEFAULT_PAGE;
  private limit = PAGINATION.DEFAULT_LIMIT;
  private hasMore = true;
  filterForm: FormGroup<{
    query: FormControl<string | null>;
    code: FormControl<{
      code: TaskTypeCode | null;
      name: string | null;
    } | null>;
  }>;
  private serviceProvidersSubject = new BehaviorSubject<ServiceProvider[]>([]);
  serviceProviders$ = this.serviceProvidersSubject.asObservable();
  selectedServiceProvider: string | null = null;
  dialogRef?: DynamicDialogRef;
  isFilterActivated = false;
  private isFormInitialized = false;
  taskTypes = Object.entries(TaskType).map(([key, value]) => ({
    code: key,
    name: value,
  }));

  TaskLabel = TaskType;

  constructor(
    private serviceProviderService: ServiceProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    this.initializeFilterForm();
    this.subscribeToFilterChanges();
    this.subscribeToRouteParams();
    this.subscribeToServiceProviderChanges();
  }

  showCreateDialog(): void {
    this.dialogRef = this.dialogService.open(ServiceProviderFormComponent, {
      header: 'New Provider',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { autoSave: true },
    });
  }

  private resetAndFetchServiceProviders(
    filters?: Nullable<ServiceProvidersFilterDto>,
  ): void {
    this.page = PAGINATION.DEFAULT_PAGE;
    this.hasMore = false;
    this.serviceProvidersSubject.next([]);
    this.fetchServiceProviders(filters);
  }

  private handleServiceProviderUpdate(
    serviceProvider: ServiceProviderPreviewDto,
  ): void {
    const currentServiceProviders = this.serviceProvidersSubject.getValue();
    const index = currentServiceProviders.findIndex(
      (t) => t.id === serviceProvider.id,
    );

    if (index !== -1) {
      currentServiceProviders[index] = serviceProvider;
    } else {
      currentServiceProviders.unshift(serviceProvider);
    }

    this.serviceProvidersSubject.next(currentServiceProviders);
  }

  private fetchServiceProviders(
    filters?: Nullable<ServiceProvidersFilterDto>,
  ): void {
    if (this.loading || (this.isLoadingMore && !this.hasMore)) return;

    this.setLoadingState(this.isInitialLoad(), !this.isInitialLoad());

    this.serviceProviderService
      .getList({
        ...filters,
        query: filters?.query ?? '',
        page: this.page,
        limit: this.limit,
      })
      .pipe(finalize(() => this.setLoadingState(false, false)))
      .subscribe((data) => {
        const currentServiceProviders = this.serviceProvidersSubject.getValue();
        this.serviceProvidersSubject.next(
          this.isInitialLoad()
            ? data.items
            : [...currentServiceProviders, ...data.items],
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
    this.selectedServiceProvider = null;
    this.selectServiceProvider(null);
  }

  selectServiceProvider(id: string | null): void {
    this.router.navigate([], {
      queryParams: { selectedServiceProvider: id },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
  }

  onNearEndScroll(): void {
    if (!this.isLoadingMore && this.hasMore) {
      this.setLoadingState(false, true);
      this.fetchServiceProviders(this.filterForm.getRawValue());
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

  private subscribeToServiceProviderChanges(): void {
    this.serviceProviderService.getChanges().subscribe((serviceProvider) => {
      if (serviceProvider) this.handleServiceProviderUpdate(serviceProvider);
    });
  }

  private subscribeToRouteParams(): void {
    this.route.queryParams
      .pipe(
        distinctUntilChanged(
          (prev, curr) =>
            prev['selectedServiceProvider'] === curr['selectedServiceProvider'],
        ),
      )
      .subscribe((params) => {
        this.selectedServiceProvider =
          params['selectedServiceProvider'] ?? null;
      });

    // Subscriber for other route params
    this.route.queryParams
      .pipe(
        filter(() => this.isFormInitialized),
        distinctUntilChanged((prev, curr) => {
          const { selectedServiceProvider: prevServiceProvider, ...prevRest } =
            prev;
          const { selectedServiceProvider: currServiceProvider, ...currRest } =
            curr;
          return JSON.stringify(prevRest) === JSON.stringify(currRest);
        }),
      )
      .subscribe(() => {
        this.isFilterActivated = this.formUtils.isAnyFilterActivated(
          this.filterForm,
        );
        this.resetAndFetchServiceProviders(this.buildFilter());
      });
  }

  private buildFilter() {
    const { query } = this.filterForm.value;
    const filters = { query } as Nullable<ServiceProvidersFilterDto>;
    filters.query = query;
    filters.competence = this.filterForm.get('code')?.value?.code;

    return filters;
  }

  private updateUrlParams(filters: Nullable<ServiceProvidersFilterDto>): void {
    const queryParams: Params = {
      query: filters?.query || null,
      competence: filters?.competence || null,
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
      code: new FormControl<{
        code: TaskTypeCode | null;
        name: string | null;
      } | null>({
        code: params?.competence ?? null,
        name: TaskType[params.competence!] ?? null,
      }),
    });

    this.isFormInitialized = true;
    this.resetAndFetchServiceProviders(this.buildFilter());
    this.router.navigate([], {
      queryParams: { client: null },
      queryParamsHandling: 'merge',
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.router.navigate([], {
      queryParams: {},
      queryParamsHandling: 'merge',
    });
  }
}
