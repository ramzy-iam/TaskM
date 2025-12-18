import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
    selector: 'ui-spinner',
    imports: [CommonModule, ProgressBarModule],
    templateUrl: './spinner.component.html'
})
export class SpinnerComponent {
  bar = input<boolean>(false);
}
