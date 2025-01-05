import { Component, OnInit, inject } from '@angular/core';
import { SectionHeaderComponent } from '@TaskM/shared/layout';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientReportComponent } from './client/client-report.component';

type UrlParams = {
  type: ReportType | null;
};

enum ReportType {
  SERVICE_PROVIDER = 'service-provider',
  CLIENT = 'client',
}

@Component({
  selector: 'app-report-layout',
  imports: [
    ReactiveFormsModule,
    SectionHeaderComponent,
    SelectButtonModule,
    ClientReportComponent,
  ],
  templateUrl: './report-layout.component.html',
})
export class ReportLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly reportTypesOptions = [
    { label: 'Client', value: 'client' },
    { label: 'Service Provider', value: 'service-provider' },
  ];
  reportTypeForm: FormGroup<{
    type: FormControl<ReportType | null>;
  }>;

  ReportType = ReportType;

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormChanges();
  }

  private subscribeToFormChanges(): void {
    this.reportTypeForm.valueChanges.subscribe((value) => {
      const params = { ...this.route.snapshot.queryParams } as UrlParams;

      Object.keys(params).forEach((key) => {
        params[key as keyof UrlParams] = null;
      });

      this.router.navigate([], {
        queryParams: { ...params, type: value.type },
        queryParamsHandling: 'merge',
      });
    });
  }
  private initializeForm(): void {
    const params = this.route.snapshot.queryParams as UrlParams;

    this.reportTypeForm = new FormGroup({
      type: new FormControl<ReportType | null>(params?.type ?? null),
    });
  }
}
