import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-item.component.html',
})
export class ListItemComponent {
  @Input() isSelected = false;
  @Input() isSelectedLoading = false;
}
