import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-list-item',
    imports: [CommonModule],
    templateUrl: './list-item.component.html'
})
export class ListItemComponent {
  readonly isSelected = input(false);
  readonly isSelectedLoading = input(false);
}
