import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixCross2 } from '@ng-icons/radix-icons';

@Component({
  selector: 'ui-close-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ radixCross2 })],
  templateUrl: './close-button.component.html',
})
export class CloseButtonComponent {
  @Input() title = 'close';
  @Output() click = new EventEmitter();

  close(): void {
    this.click.emit();
  }
}
