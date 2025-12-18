import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CompetenceDto, ServiceProviderDto } from '@TaskM/core/dto';
import { TaskType } from '@TaskM/core/constants';
import { CompetenceFormComponent } from '@TaskM/service-providers/form';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CompetenceService } from '@TaskM/service-providers/data-access';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-service-provider-competence',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    MenuModule,
    TooltipModule,
  ],
  templateUrl: './service-provider-competence.component.html',
  providers: [ConfirmationService],
})
export class ServiceProviderCompetenceComponent {
  private competenceService = inject(CompetenceService);
  private dialogService = inject(DialogService);
  private confirmationService = inject(ConfirmationService);

  readonly competence = input.required<CompetenceDto>();
  serviceProvider$ = new BehaviorSubject<ServiceProviderDto | null>(null);
  loading = false;
  items: MenuItem[] = [];

  TaskLabel = TaskType;

  constructor() {
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
      header: 'Edit Service',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: { competence: this.competence() },
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
      .delete(this.competence().id)
      .subscribe((competence) => {
        this.competenceService.triggerChanges(competence);
      });
  }
}
