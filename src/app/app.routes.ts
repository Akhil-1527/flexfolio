import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  // Remove the dashboard component reference for now since it doesn't exist yet
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page.component')
  //     .then(c => c.DashboardPageComponent),
  // },
  // Instead, redirect to auth until dashboard is implemented
  {
    path: 'dashboard',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];