import { FormControl, FormGroup } from '@angular/forms';

export type ReportForm = FormGroup<{
  client: FormGroup<{
    id: FormControl<string | null | undefined>;
    code: FormControl<string | null | undefined>;
    name: FormControl<string | null | undefined>;
  }>;
  period: FormControl<(Date | null)[] | null | undefined>;
}>;
