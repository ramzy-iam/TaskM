import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { CustomTagSeverity, TagSeverity } from '@TaskM/core/constants';

const defaultSeverities: CustomTagSeverity[] = [
  'success',
  'secondary',
  'info',
  'warning',
  'danger',
  undefined,
];

@Component({
  selector: 'ui-tag',
  standalone: true,
  imports: [CommonModule, TagModule],
  templateUrl: './tag.component.html',
})
export class TagComponent {
  value = input<string>();
  severity = input<CustomTagSeverity>();
  rounded = input<boolean>(false);

  isCustomSeverity(): TagSeverity {
    return defaultSeverities.includes(this.severity())
      ? (this.severity() as TagSeverity)
      : undefined;
  }

  getStyleClass(): string {
    if (this.isCustomSeverity()) {
      switch (this.severity()) {
        case 'orange':
          return 'bg-blue-500 text-white';
        case 'green':
          return 'bg-green-500 text-white';
        case 'red':
          return 'bg-red-500 text-white';
        default:
          return '';
      }
    }
    return '';
  }
}
