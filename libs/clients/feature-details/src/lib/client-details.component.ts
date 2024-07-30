import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '@TaskM/clients/data-access';
import { BehaviorSubject, finalize } from 'rxjs';
import { ClientDto } from '@TaskM/core/dto';
import { ClientFormComponent } from '@TaskM/clients/form';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, ClientFormComponent, SkeletonModule],
  templateUrl: './client-details.component.html',
})
export class ClientDetailsComponent implements OnChanges {
  @Input() code!: string;
  @Output() clientNotFound = new EventEmitter<void>();
  client$ = new BehaviorSubject<ClientDto | null>(null);
  loading = false;

  constructor(private clientService: ClientService) {}

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
          if (!client) this.clientNotFound.emit();

          this.client$.next(client);
        },
        error: () => {
          this.clientNotFound.emit();
        },
      });
  }
}
