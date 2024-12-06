import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-no-data',
    imports: [CommonModule],
    templateUrl: './no-data.component.html'
})
export class NoDataComponent {
  readonly message = input('No data found');
  readonly notFoundMessage = input('No matching data');
  readonly isNotFound = input(false);

  get displayedMessage(): string {
    return this.isNotFound() ? this.notFoundMessage() : this.message();
  }
}
