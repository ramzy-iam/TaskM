import { Component, OnChanges, SimpleChanges, input, inject } from '@angular/core';
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
    imports: [
        CommonModule,
        ClientFormComponent,
        SkeletonModule,
        CloseButtonComponent,
    ],
    templateUrl: './client-preview.component.html'
})
export class ClientPreviewComponent implements OnChanges {
  private clientService = inject(ClientService);
  private router = inject(Router);

  readonly code = input.required<string>();
  client$ = new BehaviorSubject<ClientDto | null>(null);
  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    const code = this.code();
    if (changes['code'] && code) {
      this.fetchClient(code);
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
