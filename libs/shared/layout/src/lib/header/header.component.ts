import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { RouterModule } from '@angular/router';
import { heroBars3BottomLeft } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-header',
  standalone: true,
  providers: [
    provideIcons({
      heroBars3BottomLeft,
    }),
  ],
  imports: [CommonModule,RouterModule, NgIconComponent, OverlayModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }


}
