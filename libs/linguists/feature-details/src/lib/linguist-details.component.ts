import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinguistService } from '@TaskM/linguists/data-access';
import { BehaviorSubject, finalize } from 'rxjs';
import { LinguistDto } from '@TaskM/core/dto';
import { LinguistFormComponent } from '@TaskM/linguists/form';
import { SkeletonModule } from 'primeng/skeleton';
import { CloseButtonComponent } from '@TaskM/shared/ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-linguist-details',
  standalone: true,
  imports: [
    CommonModule,
    LinguistFormComponent,
    SkeletonModule,
    CloseButtonComponent,
  ],
  templateUrl: './linguist-details.component.html',
})
export class LinguistDetailsComponent implements OnChanges {
  @Input() linguistId!: string;
  linguist$ = new BehaviorSubject<LinguistDto | null>(null);
  loading = false;

  constructor(
    private linguistService: LinguistService,
    private router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linguistId'] && this.linguistId) {
      this.fetchLinguist(this.linguistId);
    }
  }

  fetchLinguist(linguistId: string): void {
    this.loading = true;
    this.linguistService
      .findOne({ id: linguistId }, { error: { onError: false } })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (linguist) => {
          if (!linguist) this.close();

          this.linguist$.next(linguist);
        },
        error: () => {
          this.close();
        },
      });
  }

  close(): void {
    this.router.navigate([], {
      queryParams: { selectedLinguist: null },
      queryParamsHandling: 'merge',
    });
  }
}
