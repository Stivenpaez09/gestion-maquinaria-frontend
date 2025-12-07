import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./features/logins/pages/login/login').then((m) => m.Login),
    title: 'Servimacons SAS - Login',
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashbord/dashbord').then((m) => m.Dashbord),
    title: 'Dashboard',
  },
  {
    path: 'dashboard-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/dashboard/pages/inicio/inicio').then((m) => m.Inicio),
    title: 'Dashboard',
  },
  {
    path: 'maquinaria',
    loadComponent: () =>
      import('./features/admin/maquinaria/pages/maquinaria/maquinaria').then((m) => m.Maquinaria),
    title: 'Maquinaria',
  },
  {
    path: 'crear-maquinaria',
    loadComponent: () =>
      import('./features/admin/maquinaria/pages/crear-maquinaria/crear-maquinaria').then(
        (m) => m.CrearMaquinaria
      ),
    title: 'Maquinaria',
  },
];
