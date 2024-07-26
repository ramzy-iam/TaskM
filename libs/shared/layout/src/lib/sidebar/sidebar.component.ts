import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Link } from './link';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBuildingOffice,heroSquares2x2, heroPresentationChartBar, heroUserGroup,heroQueueList,  } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [
    provideIcons({
      heroBuildingOffice,
      heroSquares2x2,
      heroPresentationChartBar,
      heroUserGroup,
      heroQueueList
    }),
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() isOpen = true;


  links: Link[] = [
    // {
    //   icon: 'heroSquares2x2',
    //   label: 'Dashboard',
    //   link: 'dashboard',
    // },
    {
      icon: 'heroBuildingOffice',
      label: 'Clients',
      link: 'clients',
    },
    {
      icon: 'heroPresentationChartBar',
      label: 'Projects',
      link: 'projects',
    },

    {
      icon: 'heroQueueList',
      label: 'Tasks',
      link: 'tasks',
    },
    {
      icon: 'heroUserGroup',
      label: 'Linguists',
      link: 'linguists',
    },
  ];
}
