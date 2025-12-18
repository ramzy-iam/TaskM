import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixCross2 } from '@ng-icons/radix-icons';

@Component({
    selector: 'ui-close-button',
    imports: [CommonModule, NgIconComponent],
    providers: [provideIcons({ radixCross2 })],
    templateUrl: './close-button.component.html'
})
export class CloseButtonComponent {
  readonly title = input('close');
  readonly click = output();

  close(): void {
    this.click.emit();
  }
}
