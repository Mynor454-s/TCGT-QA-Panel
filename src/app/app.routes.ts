import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent),
  },
  {
    path: 'tests',
    loadComponent: () =>
      import('./features/test-management/test-list-page.component').then(
        (m) => m.TestListPageComponent,
      ),
  },
  {
    path: 'data-providers',
    loadComponent: () =>
      import('./features/data-provider/data-provider-page.component').then(
        (m) => m.DataProviderPageComponent,
      ),
  },
  {
    path: 'execute',
    loadComponent: () =>
      import('./features/execution/execution-config-page.component').then(
        (m) => m.ExecutionConfigPageComponent,
      ),
  },
  {
    path: 'reports/:runId',
    loadComponent: () =>
      import('./features/reports/report-detail-page.component').then(
        (m) => m.ReportDetailPageComponent,
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./features/history/history-page.component').then((m) => m.HistoryPageComponent),
  },
  {
    path: 'scheduling',
    loadComponent: () =>
      import('./features/scheduling/scheduling-page.component').then(
        (m) => m.SchedulingPageComponent,
      ),
  },
  {
    path: 'configuration',
    loadComponent: () =>
      import('./features/configuration/configuration-page.component').then(
        (m) => m.ConfigurationPageComponent,
      ),
  },
  { path: '**', redirectTo: 'dashboard' },
];
