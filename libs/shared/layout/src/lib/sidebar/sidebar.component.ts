import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Link } from './link';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBuildingOffice,
  heroSquares2x2,
  heroPresentationChartBar,
  heroUserGroup,
  heroQueueList,
  heroDocumentChartBar,
} from '@ng-icons/heroicons/outline';
import { StorageService } from '@TaskM/shared/misc';
import { SIDEBAR_KEY } from '@TaskM/core/constants';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, NgIconComponent, TooltipModule],
  providers: [
    provideIcons({
      heroBuildingOffice,
      heroSquares2x2,
      heroPresentationChartBar,
      heroUserGroup,
      heroQueueList,
      heroDocumentChartBar,
    }),
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  private readonly storageService = inject<StorageService>(StorageService);

  private _isOpen?: boolean | null;

  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    this.storageService.setItem(SIDEBAR_KEY, value);
  }

  get isOpen(): boolean {
    return !!this._isOpen;
  }

  ngOnInit() {
    this._isOpen = !!this.storageService.getItem(SIDEBAR_KEY, true);
  }

  links: Link[] = [
    {
      icon: 'heroSquares2x2',
      label: 'Dashboard',
      link: 'dashboard',
    },
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
      label: 'Service Providers',
      link: 'service-providers',
    },
    {
      icon: 'heroDocumentChartBar',
      label: 'Reports',
      link: 'reports',
    },
  ];
}
