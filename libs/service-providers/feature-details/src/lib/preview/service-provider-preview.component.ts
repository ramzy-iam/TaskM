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
  ServiceProviderService,
} from '@TaskM/service-providers/data-access';
import { BehaviorSubject, finalize } from 'rxjs';
import { CompetenceDto, ServiceProviderDto } from '@TaskM/core/dto';
import { TaskType } from '@TaskM/core/constants';
import {
  CompetenceFormComponent,
  ServiceProviderFormComponent,
} from '@TaskM/service-providers/form';
import { SkeletonModule } from 'primeng/skeleton';
import { CloseButtonComponent } from '@TaskM/shared/ui';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ServiceProviderCompetenceComponent } from '../competence/service-provider-competence.component';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-service-provider-preview',
  standalone: true,
  imports: [
    CommonModule,
    ServiceProviderFormComponent,
    SkeletonModule,
    CloseButtonComponent,
    ButtonModule,
    DialogModule,
    ServiceProviderCompetenceComponent,
    PanelModule,
  ],
  templateUrl: './service-provider-preview.component.html',
})
export class ServiceProviderPreviewComponent implements OnInit, OnChanges {
  @Input() serviceProviderId!: string;
  private serviceProvidersSubject =
    new BehaviorSubject<ServiceProviderDto | null>(null);
  loading = false;
  serviceProvider$ = this.serviceProvidersSubject.asObservable();

  TaskLabel = TaskType;

  constructor(
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private dialogService: DialogService,
    private competenceService: CompetenceService,
  ) {}

  ngOnInit(): void {
    this.subscribeToCompetenceChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serviceProviderId'] && this.serviceProviderId) {
      this.fetchServiceProvider(this.serviceProviderId);
    }
  }

  showCompetenceDialog(competence?: CompetenceDto): void {
    const serviceProviderCompetences =
      this.serviceProvidersSubject?.value?.competences ?? [];
    this.dialogService.open(CompetenceFormComponent, {
      header: 'New Service',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      style: { width: '50vw' },
      modal: true,
      closeOnEscape: true,
      data: {
        competence: {
          ...competence,
          serviceProviderId: this.serviceProviderId,
        },
        serviceProviderCompetences,
      },
    });
  }

  fetchServiceProvider(serviceProviderId: string): void {
    this.loading = true;
    this.serviceProviderService
      .findOne({ id: serviceProviderId }, { error: { onError: false } })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (serviceProvider) => {
          if (!serviceProvider) this.close();

          this.serviceProvidersSubject.next(serviceProvider);
        },
        error: () => {
          this.close();
        },
      });
  }

  close(): void {
    this.router.navigate([], {
      queryParams: { selectedServiceProvider: null },
      queryParamsHandling: 'merge',
    });
  }

  subscribeToCompetenceChanges(): void {
    this.competenceService.getChanges<Competence>().subscribe((competence) => {
      this.handleCompetenceUpdate(competence);
    });
  }

  private handleCompetenceUpdate(competence: Competence): void {
    const serviceProvider = this.serviceProvidersSubject
      .value as ServiceProviderDto;
    const competences = serviceProvider?.competences ?? [];

    const index = competences.findIndex((t) => t.id === competence.id);
    const fromIdIndex = competence.fromId
      ? competences.findIndex((t) => t.id === competence.fromId)
      : -1;

    delete competence.fromId;

    if (index !== -1) {
      if (competence.deletedAt) competences.splice(index, 1);
      else competences[index] = competence;
    } else if (fromIdIndex !== -1) competences[fromIdIndex] = competence;
    else competences.push(competence);

    this.serviceProvidersSubject.next({ ...serviceProvider, competences });
    this.serviceProviderService.triggerChanges({
      ...serviceProvider,
      competences,
    });
  }
}
