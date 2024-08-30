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
import { Linguist, LinguistService } from '@TaskM/linguists/data-access';
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
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LinguistPreviewDto, LinguistsFilterDto } from '@TaskM/core/dto';
import { LinguistDetailsComponent } from '@TaskM/linguists/feature-details';
import { LinguistFormComponent } from '@TaskM/linguists/form';
import { SkeletonModule } from 'primeng/skeleton';
import { FormUtilsService, ScrollNearEndDirective } from '@TaskM/shared/misc';
import { PAGINATION } from '@TaskM/core/constants';
import { Nullable } from '@TaskM/core/types';

type UrlParams = LinguistsFilterDto & {
  selectedLinguist: string | null;
};
@Component({
  selector: 'app-linguist-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconComponent,
    SectionHeaderComponent,
    ButtonModule,
    InputTextModule,
    InputSearchComponent,
    ListItemComponent,
    LinguistDetailsComponent,
    DialogModule,
    LinguistFormComponent,
    SkeletonModule,
    SpinnerComponent,
    ScrollNearEndDirective,
    NoDataComponent,
  ],
  providers: [DialogService, provideIcons({ radixCross2 })],
  templateUrl: './linguist-list.component.html',
  host: { class: 'h-full py-1' },
})
export class LinguistListComponent implements OnInit, OnDestroy {
  loading = false;
  isLoadingMore = false;
  private page = PAGINATION.DEFAULT_PAGE;
  private limit = PAGINATION.DEFAULT_LIMIT;
  private hasMore = true;
  filterForm: FormGroup<{
    query: FormControl<string | null>;
  }>;
  private linguistsSubject = new BehaviorSubject<Linguist[]>([]);
  linguists$ = this.linguistsSubject.asObservable();
  selectedLinguist: string | null = null;
  dialogRef?: DynamicDialogRef;
  isFilterActivated = false;
  private isFormInitialized = false;

  constructor(
    private linguistService: LinguistService,
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
    this.dialogRef = this.dialogService.open(LinguistFormComponent, {
      header: 'New Linguist',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { autoSave: true },
    });
  }

  private resetAndFetchLinguists(filters?: Nullable<LinguistsFilterDto>): void {
    this.page = PAGINATION.DEFAULT_PAGE;
    this.hasMore = false;
    this.linguistsSubject.next([]);
    this.fetchLinguists(filters);
  }

  private handleLinguistUpdate(linguist: LinguistPreviewDto): void {
    const currentLinguists = this.linguistsSubject.getValue();
    const index = currentLinguists.findIndex((t) => t.id === linguist.id);

    if (index !== -1) {
      currentLinguists[index] = linguist;
    } else {
      currentLinguists.unshift(linguist);
    }

    this.linguistsSubject.next(currentLinguists);
  }

  private fetchLinguists(filters?: Nullable<LinguistsFilterDto>): void {
    if (this.loading || (this.isLoadingMore && !this.hasMore)) return;

    this.setLoadingState(this.isInitialLoad(), !this.isInitialLoad());

    this.linguistService
      .getList({
        ...filters,
        query: filters?.query ?? '',
        page: this.page,
        limit: this.limit,
      })
      .pipe(finalize(() => this.setLoadingState(false, false)))
      .subscribe((data) => {
        const currentLinguists = this.linguistsSubject.getValue();
        this.linguistsSubject.next(
          this.isInitialLoad()
            ? data.items
            : [...currentLinguists, ...data.items],
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
    this.selectedLinguist = null;
    this.selectLinguist(null);
  }

  selectLinguist(id: string | null): void {
    this.router.navigate([], {
      queryParams: { selectedLinguist: id },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
  }

  onNearEndScroll(): void {
    if (!this.isLoadingMore && this.hasMore) {
      this.setLoadingState(false, true);
      this.fetchLinguists(this.filterForm.getRawValue());
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
    this.linguistService.getChanges().subscribe((linguist) => {
      if (linguist) this.handleLinguistUpdate(linguist);
    });
  }

  private subscribeToRouteParams(): void {
    this.route.queryParams
      .pipe(
        distinctUntilChanged(
          (prev, curr) => prev['selectedLinguist'] === curr['selectedLinguist'],
        ),
      )
      .subscribe((params) => {
        this.selectedLinguist = params['selectedLinguist'] ?? null;
      });

    // Subscriber for other route params
    this.route.queryParams
      .pipe(
        filter(() => this.isFormInitialized),
        distinctUntilChanged((prev, curr) => {
          const { selectedLinguist: prevLinguist, ...prevRest } = prev;
          const { selectedLinguist: currLinguist, ...currRest } = curr;
          return JSON.stringify(prevRest) === JSON.stringify(currRest);
        }),
      )
      .subscribe(() => {
        this.resetAndFetchLinguists(this.buildFilter());
      });
  }

  private buildFilter() {
    const { query } = this.filterForm.value;
    const filters = { query } as LinguistsFilterDto;
    filters.query = query;

    return filters;
  }

  private updateUrlParams(filters: Nullable<LinguistsFilterDto>): void {
    const queryParams: Params = {
      query: filters?.query || null,
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
    this.resetAndFetchLinguists(this.buildFilter());
    this.router.navigate([], {
      queryParams: { client: null },
      queryParamsHandling: 'merge',
    });
  }
}
