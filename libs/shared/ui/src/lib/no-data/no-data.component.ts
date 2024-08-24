import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-no-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-data.component.html',
})
export class NoDataComponent {
  @Input() message = 'No data found';
  @Input() notFoundMessage = 'No matching data';
  @Input() isNotFound = false;

  get displayedMessage(): string {
    return this.isNotFound ? this.notFoundMessage : this.message;
  }
}
