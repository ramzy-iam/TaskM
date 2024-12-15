import { Component, OnInit, inject } from '@angular/core';
import { SectionHeaderComponent } from '@TaskM/shared/layout';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

type UrlParams = {
  type: ReportType | null;
};

enum ReportType {
  SERVICE_PROVIDER = 'service-provider',
  CLIENT = 'client',
}

@Component({
  selector: 'app-report-layout',
  imports: [ReactiveFormsModule, SectionHeaderComponent, SelectButtonModule],
  templateUrl: './report-layout.component.html',
})
export class ReportLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly reportTypesOptions = [
    { label: 'Service Provider', value: 'service-provider' },
    { label: 'Client', value: 'client' },
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
      this.router.navigate([], {
        queryParams: { type: value.type },
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
