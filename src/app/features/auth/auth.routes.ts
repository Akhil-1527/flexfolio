import { Routes } from '@angular/router';

// Using functional loadComponent for optimal lazy loading
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component')
      .then(c => c.LoginPageComponent),
    title: 'Login - Flexfolio'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register-page/register-page.component')
      .then(c => c.RegisterPageComponent),
    title: 'Create Account - Flexfolio'
  }
];