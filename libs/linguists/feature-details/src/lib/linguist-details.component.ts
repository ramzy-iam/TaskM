import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Competence,
  CompetenceService,
  LinguistService,
} from '@TaskM/linguists/data-access';
import { BehaviorSubject, finalize } from 'rxjs';
import { CompetenceDto, LinguistDto } from '@TaskM/core/dto';
import { TaskType } from '@TaskM/core/constants';
import {
  CompetenceFormComponent,
  LinguistFormComponent,
} from '@TaskM/linguists/form';
import { SkeletonModule } from 'primeng/skeleton';
import { CloseButtonComponent } from '@TaskM/shared/ui';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { LinguistCompetenceComponent } from './competence/linguist-competence.component';

@Component({
  selector: 'app-linguist-details',
  standalone: true,
  imports: [
    CommonModule,
    LinguistFormComponent,
    SkeletonModule,
    CloseButtonComponent,
    ButtonModule,
    DialogModule,
    LinguistCompetenceComponent,
  ],
  templateUrl: './linguist-details.component.html',
})
export class LinguistDetailsComponent implements OnInit, OnChanges {
  @Input() linguistId!: string;
  private linguistsSubject = new BehaviorSubject<LinguistDto | null>(null);
  loading = false;
  linguist$ = this.linguistsSubject.asObservable();

  TaskLabel = TaskType;

  constructor(
    private linguistService: LinguistService,
    private router: Router,
    private dialogService: DialogService,
    private competenceService: CompetenceService,
  ) {}

  ngOnInit(): void {
    this.subscribeToCompetenceChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linguistId'] && this.linguistId) {
      this.fetchLinguist(this.linguistId);
    }
  }

  showCompetenceDialog(competence?: CompetenceDto): void {
    this.dialogService.open(CompetenceFormComponent, {
      header: 'New Competence',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { competence: { ...competence, linguistId: this.linguistId } },
    });
  }

  fetchLinguist(linguistId: string): void {
    this.loading = true;
    this.linguistService
      .findOne({ id: linguistId }, { error: { onError: false } })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (linguist) => {
          if (!linguist) this.close();

          this.linguistsSubject.next(linguist);
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

  subscribeToCompetenceChanges(): void {
    this.competenceService.getChanges<Competence>().subscribe((competence) => {
      this.handleCompetenceUpdate(competence);
    });
  }

  private handleCompetenceUpdate(competence: Competence): void {
    const linguist = this.linguistsSubject.value!;
    let competences = linguist?.competences ?? [];

    const index = competences.findIndex((t) => t.id === competence.id);
    const fromIdIndex = competence.fromId
      ? competences.findIndex((t) => t.id === competence.fromId)
      : -1;

    delete competence.fromId;

    if (index !== -1) {
      if (competence.deletedAt) competences.splice(index, 1);
      else competences[index] = competence;
    } else if (fromIdIndex !== -1) competences[fromIdIndex] = competence;
    else competences.unshift(competence);

    this.linguistsSubject.next({ ...linguist, competences });
  }
}
