import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavBarComponent],
  templateUrl: './base-layout.component.html',
})
export class BaseLayoutComponent {}
