import { Component, Input, OnInit, OnDestroy, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinguistService } from '@TaskM/linguists/data-access';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  Subscription,
} from 'rxjs';
import { LinguistDto } from '@TaskM/core/dto';
import { BaseEnumComponent, FormUtilsService } from '@TaskM/shared/misc';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormInputErrorComponent } from '@TaskM/shared/ui';

@Component({
  selector: 'app-linguist-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule,
    InputNumberModule,
    FormInputErrorComponent,
  ],
  templateUrl: './linguist-form.component.html',
})
export class LinguistFormComponent
  extends BaseEnumComponent
  implements OnInit, OnDestroy
{
  private _linguist!: LinguistDto;
  form!: FormGroup;
  loading = false;
  private initialFormValues: any;
  private formValueChangesSubscription!: Subscription;

  constructor(
    private linguistService: LinguistService,
    @Optional() public dialogRef: DynamicDialogRef,
    private formUtils: FormUtilsService,
  ) {
    super();
  }

  @Input() autoSave?: boolean = false;
  @Input()
  set linguist(linguist: LinguistDto | null) {
    if (linguist) {
      this._linguist = linguist;
    }
    this.initializeForm(linguist);
  }

  ngOnInit() {
    this.initializeForm(this._linguist);
    this.triggerAutoSave();
  }

  ngOnDestroy() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  private initializeForm(linguist: LinguistDto | null) {
    this.form = new FormGroup({
      firstName: new FormControl<string | undefined>(linguist?.firstName, [
        Validators.required,
      ]),
      lastName: new FormControl<string | undefined>(linguist?.lastName, [
        Validators.required,
      ]),
      email: new FormControl<string | undefined>(linguist?.email, [
        Validators.required,
        Validators.email,
      ]),
      accountType: new FormControl<string>(linguist?.accountType ?? '', [
        Validators.required,
      ]),
      accountName: new FormControl<string | undefined>(linguist?.accountName, [
        Validators.required,
      ]),
      accountNumber: new FormControl<string | undefined>(
        linguist?.accountNumber,
        [Validators.required],
      ),
      phone: new FormControl<string | undefined>(linguist?.phone, [
        Validators.required,
      ]),
    });

    // Store initial form values
    this.initialFormValues = this.form.value;
  }

  get linguist(): LinguistDto {
    return this._linguist;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const values = this.form.value;
    const operation = this.linguist?.id
      ? this.linguistService.update(this.linguist.id, values)
      : this.linguistService.create(values);

    operation.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (linguist: LinguistDto) => {
        if (this.dialogRef && !this.linguist?.id) this.dialogRef.close();
        // Store form values
        this.initialFormValues = this.form.value;
        this.linguistService.triggerChanges(linguist);
      },
      error: (error) => {
        // Unsubscribe before resetting the form to avoid triggering the update
        if (this.formValueChangesSubscription) {
          this.formValueChangesSubscription.unsubscribe();
        }

        this.formUtils.handleErrors(this.form, error.error);

        if (this.linguist?.id) this.form.patchValue(this.initialFormValues); // Reset form with initial values on error

        // Resubscribe to form value changes
        this.triggerAutoSave();
      },
    });
  }

  private triggerAutoSave() {
    this.formValueChangesSubscription = this.form.valueChanges
      .pipe(
        filter(() => !!this.autoSave),
        debounceTime(3000),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
      )
      .subscribe(() => {
        this.onSubmit();
      });
  }
}
