import { BaseLayoutComponent } from '@TaskM/shared/layout';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [],
  },
];
