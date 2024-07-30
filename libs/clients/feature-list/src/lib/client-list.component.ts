import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '@TaskM/shared/layout';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixCross2 } from '@ng-icons/radix-icons';
import { InputSearchComponent, ListItemComponent } from '@TaskM/shared/ui';
import { Client, ClientService } from '@TaskM/clients/data-access';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  finalize,
} from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ClientPreviewDto } from '@TaskM/core/dto';
import { ClientDetailsComponent } from '@TaskM/clients/feature-details';
import { ClientFormComponent } from '@TaskM/clients/form';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconComponent,
    NgIconComponent,
    SectionHeaderComponent,
    ButtonModule,
    InputTextModule,
    InputSearchComponent,
    ListItemComponent,
    ClientDetailsComponent,
    DialogModule,
    ClientFormComponent,
  ],
  providers: [
    DialogService,
    provideIcons({
      radixCross2,
    }),
  ],

  templateUrl: './client-list.component.html',
  host: { class: 'h-full py-1' },
})
export class ClientListComponent implements OnInit, OnDestroy {
  loading = false;
  private page = 1;
  private limit = 20;
  private hasMore = true;
  searchForm = new FormGroup({
    query: new FormControl<string>(''),
  });
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSubject.asObservable();
  selectedClientCode: string | null = null;
  dialogRef?: DynamicDialogRef | undefined;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe({
        next: (formValues) => {
          this.page = 1;
          this.hasMore = true;
          this.clientsSubject.next([]);

          this.getClients(formValues.query, true);
        },
      });
    this.getClients(undefined, true);

    this.clientService.getChanges().subscribe((client) => {
      if (client) {
        this.updateList(client);
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.selectedClientCode = params['selectedClient'] ?? null;
    });
  }

  showCreateDialog() {
    this.dialogRef = this.dialogService.open(ClientFormComponent, {
      header: 'Create client',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { autoSave: true },
    });
  }

  private updateList(client: ClientPreviewDto): void {
    let currentClients = this.clientsSubject.getValue();
    const index = currentClients.findIndex((t) => t.id === client.id);
    if (index !== -1) {
      currentClients[index] = client;
    } else {
      currentClients.unshift(client);
    }
    this.clientsSubject.next(currentClients);
  }

  getClients(query?: string | null, loadMore = false): void {
    if (this.loading || (loadMore && !this.hasMore)) return;
    this.loading = true;
    if (!loadMore) {
      this.page = 1;
      this.clientsSubject.next([]); // Clear current clients if it's a new query
      return;
    }
    this.clientService
      .getList({
        query: query ?? '',
        page: this.page,
        limit: this.limit,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((data) => {
        let currentClients = this.clientsSubject.getValue();
        currentClients = loadMore
          ? [...currentClients, ...data.items]
          : data.items;
        this.clientsSubject.next(currentClients); // Emit the new or updated list

        this.page++;
      });
  }

  closeChild() {
    this.selectedClientCode = null;
    this.selectClient(null);
  }

  selectClient(clientCode: string | null): void {
    this.router.navigate([], {
      queryParams: { selectedClient: clientCode },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
