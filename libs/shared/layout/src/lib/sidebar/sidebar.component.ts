import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Link } from './link';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherUsers } from '@ng-icons/feather-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [
    provideIcons({
      featherUsers,
    }),
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  links: Link[] = [
    {
      icon: 'featherUsers',
      label: 'Linguist',
      link: 'members',
    },
  ];
}
