import { Component, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseEnumComponent, FormUtilsService } from '@TaskM/shared/misc';
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
  private formUtils = inject(FormUtilsService);

  filterForm = input.required<ReportForm>();
  formGroup: ReportForm;
  loading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.formGroup = new FormGroup({
      client: this.formUtils.createMinimalClientForm(null, { required: true }),
      period: new FormControl<(Date | null)[] | null | undefined>(null, [
        Validators.required,
      ]),
    });
  }

  generateReport() {
    this.loading = true;
    setTimeout(() => {
      this.filterForm().patchValue(this.formGroup.value);
      this.loading = false;
    }, 500);
  }
}
