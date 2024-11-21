import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '@TaskM/clients/data-access';
import { BehaviorSubject, finalize } from 'rxjs';
import { ClientDto } from '@TaskM/core/dto';
import { ClientFormComponent } from '@TaskM/clients/form';
import { SkeletonModule } from 'primeng/skeleton';
import { CloseButtonComponent } from '@TaskM/shared/ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-preview',
  standalone: true,
  imports: [
    CommonModule,
    ClientFormComponent,
    SkeletonModule,
    CloseButtonComponent,
  ],
  templateUrl: './client-preview.component.html',
})
export class ClientPreviewComponent implements OnChanges {
  @Input() code!: string;
  client$ = new BehaviorSubject<ClientDto | null>(null);
  loading = false;

  constructor(
    private clientService: ClientService,
    private router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] && this.code) {
      this.fetchClient(this.code);
    }
  }

  fetchClient(clientCode: string): void {
    this.loading = true;
    this.clientService
      .findOne({ code: clientCode })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (client) => {
          if (!client) this.close();

          this.client$.next(client);
        },
        error: () => {
          this.close();
        },
      });
  }

  close(): void {
    this.router.navigate([], {
      queryParams: { selectedClient: null },
      queryParamsHandling: 'merge',
    });
  }
}
