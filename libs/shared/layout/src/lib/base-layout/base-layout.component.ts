import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ToastModule } from 'primeng/toast';
import { StorageService } from '@TaskM/shared/misc';
import { SIDEBAR_KEY } from '@TaskM/core/constants';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    HeaderComponent,
    ToastModule,
  ],
  templateUrl: './base-layout.component.html',
})
export class BaseLayoutComponent {
  constructor(private storageService: StorageService) {}
  isSidebarOpen = !!this.storageService.getItem(SIDEBAR_KEY, true);

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
