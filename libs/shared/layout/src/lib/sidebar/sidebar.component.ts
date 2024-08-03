import { Component, Input, OnInit } from '@angular/core';
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
} from '@ng-icons/heroicons/outline';
import { LocalStorageService } from '@TaskM/shared/misc';
import { SIDEBAR_KEY } from '@TaskM/core/constants';

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
      heroQueueList,
    }),
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  private _isOpen = this.localStorageService.getItem<boolean>(
    SIDEBAR_KEY,
    true,
  )!;
  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    this.localStorageService.setItem(SIDEBAR_KEY, value);
  }

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this._isOpen = this.localStorageService.getItem(SIDEBAR_KEY, true)!;
  }
  get isOpen(): boolean {
    return this._isOpen;
  }

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
