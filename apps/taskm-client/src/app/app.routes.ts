import { BaseLayoutComponent } from '@TaskM/shared/layout';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'clients',
        loadComponent: () =>
          import('@TaskM/clients/feature-list').then(
            (c) => c.ClientListComponent,
          ),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('@TaskM/projects/feature-list').then(
            (c) => c.ProjectListComponent,
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('@TaskM/tasks/feature-list').then((c) => c.TaskListComponent),
      },
      {
        path: 'service-providers',
        loadComponent: () =>
          import('@TaskM/service-providers/feature-list').then(
            (c) => c.ServiceProviderListComponent,
          ),
      },
    ],
  },
];
