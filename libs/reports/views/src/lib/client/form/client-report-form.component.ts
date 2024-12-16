import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { RouterModule } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseEnumComponent } from '@TaskM/shared/misc';
import { ClientAutocompleteComponent } from '@TaskM/clients/form';
import { CalendarModule } from 'primeng/calendar';
import { ReportForm } from '../form';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-client-report-form',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    ClientAutocompleteComponent,
    CalendarModule,
    FloatLabelModule,
  ],
  templateUrl: './client-report-form.component.html',

  host: { class: 'h-full py-1' },
})
export class ClientReportFormComponent
  extends BaseEnumComponent
  implements OnInit
{
  filterForm = input.required<ReportForm>();
  formGroup: ReportForm;
  loading = false;

  ngOnInit(): void {
    this.formGroup = new FormGroup(this.filterForm().controls);
  }

  generateReport() {
    this.loading = true;
    setTimeout(() => {
      this.filterForm().patchValue(this.formGroup.value);
      this.loading = false;
    }, 500);
  }
}
