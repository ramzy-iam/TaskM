import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CompetenceDto, LinguistDto } from '@TaskM/core/dto';
import { TaskType } from '@TaskM/core/constants';
import { CompetenceFormComponent } from '@TaskM/linguists/form';
import { CloseButtonComponent } from '@TaskM/shared/ui';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CompetenceService } from '@TaskM/linguists/data-access';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-linguist-competence',
  standalone: true,
  imports: [
    CommonModule,
    CloseButtonComponent,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    MenuModule,
  ],
  templateUrl: './linguist-competence.component.html',
  providers: [ConfirmationService],
})
export class LinguistCompetenceComponent {
  @Input() competence!: CompetenceDto;
  linguist$ = new BehaviorSubject<LinguistDto | null>(null);
  loading = false;
  items: MenuItem[] = [];

  TaskLabel = TaskType;

  constructor(
    private competenceService: CompetenceService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
  ) {
    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          this.edit();
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: (event) => {
          this.delete(event.originalEvent as Event);
        },
      },
    ];
  }

  private edit(): void {
    this.dialogService.open(CompetenceFormComponent, {
      header: 'Edit Skill',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { competence: this.competence },
    });
  }

  private delete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete?',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.deleteCompetence();
      },
      reject: () => {
        //
      },
    });
  }

  private deleteCompetence() {
    this.competenceService
      .delete(this.competence.id)
      .subscribe((competence) => {
        this.competenceService.triggerChanges(competence);
      });
  }
}
