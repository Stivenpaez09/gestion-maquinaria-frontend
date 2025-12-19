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
    path: 'dashboard-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/dashboard/pages/inicio/inicio').then((m) => m.Inicio),
    title: 'Dashboard',
  },
  {
    path: 'ver-maquinarias-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/maquinaria/pages/ver-maquinarias-admin/ver-maquinarias-admin').then(
        (m) => m.VerMaquinariasAdmin
      ),
    title: 'Maquinaria',
  },
  {
    path: 'crear-maquinaria-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/maquinaria/pages/crear-maquinaria-admin/crear-maquinaria-admin'
      ).then((m) => m.CrearMaquinariaAdmin),
    title: 'Maquinaria',
  },
  {
    path: 'detalles-maquinaria-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/maquinaria/pages/detalles-maquinaria-admin/detalles-maquinaria-admin'
      ).then((m) => m.DetallesMaquinariaAdmin),
    title: 'Maquinaria',
  },
  {
    path: 'ver-empresas-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/empresa/pages/ver-empresas-admin/ver-empresas-admin').then(
        (m) => m.VerEmpresasAdmin
      ),
    title: 'Empresas',
  },
  {
    path: 'crear-empresa-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/empresa/pages/crear-empresa-admin/crear-empresa-admin').then(
        (m) => m.CrearEmpresaAdmin
      ),
    title: 'Empresas',
  },
  {
    path: 'detalles-empresa-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/empresa/pages/detalles-empresa-admin/detalles-empresa-admin').then(
        (m) => m.DetallesEmpresaAdmin
      ),
    title: 'Empresas',
  },
  {
    path: 'ver-proyectos-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/proyectos/pages/ver-proyectos-admin/ver-proyectos-admin').then(
        (m) => m.VerProyectosAdmin
      ),
    title: 'Proyectos',
  },
  {
    path: 'crear-proyecto-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/proyectos/pages/crear-proyecto-admin/crear-proyecto-admin').then(
        (m) => m.CrearProyectoAdmin
      ),
    title: 'Proyectos',
  },
  {
    path: 'detalles-proyecto-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/proyectos/pages/detalles-proyecto-admin/detalles-proyecto-admin'
      ).then((m) => m.DetallesProyectoAdmin),
    title: 'Proyectos',
  },
  {
    path: 'detalles-mantenimiento-programado-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/mantenimiento_programado/pages/detalles-mantenimiento-programado-admin/detalles-mantenimiento-programado-admin'
      ).then((m) => m.DetallesMantenimientoProgramadoAdmin),
    title: 'Mantenimiento Programado',
  },
  {
    path: 'ver-mantenimientos-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/mantenimiento/pages/ver-mantenimientos-admin/ver-mantenimientos-admin'
      ).then((m) => m.VerMantenimientosAdmin),
    title: 'Mantenimientos',
  },
  {
    path: 'crear-mantenimiento-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/mantenimiento/pages/crear-mantenimiento-admin/crear-mantenimiento-admin'
      ).then((m) => m.CrearMantenimientoAdmin),
    title: 'Mantenimientos',
  },
  {
    path: 'detalles-mantenimiento-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/mantenimiento/pages/detalles-mantenimiento-admin/detalles-mantenimiento-admin'
      ).then((m) => m.DetallesMantenimientoAdmin),
    title: 'Mantenimientos',
  },
  {
    path: 'ver-registros-horas-maquinaria-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/registro-horas-maquinaria/pages/ver-registros-horas-maquinaria-admin/ver-registros-horas-maquinaria-admin'
      ).then((m) => m.VerRegistrosHorasMaquinariaAdmin),
    title: 'Registro Horas Maquinaria',
  },
  {
    path: 'crear-registro-horas-maquinaria-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/registro-horas-maquinaria/pages/crear-registro-horas-maquinaria-admin/crear-registro-horas-maquinaria-admin'
      ).then((m) => m.CrearRegistroHorasMaquinariaAdmin),
    title: 'Registro Horas Maquinaria',
  },
  {
    path: 'detalles-registro-horas-maquinaria-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/registro-horas-maquinaria/pages/detalles-registro-horas-maquinaria-admin/detalles-registro-horas-maquinaria-admin'
      ).then((m) => m.DetallesRegistroHorasMaquinariaAdmin),
    title: 'Registro Horas Maquinaria',
  },
  {
    path: 'ver-usuarios-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/usuario/pages/ver-usuarios-admin/ver-usuarios-admin').then(
        (m) => m.VerUsuariosAdmin
      ),
    title: 'Usuarios',
  },
  {
    path: 'crear-usuario-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/usuario/pages/crear-usuario-admin/crear-usuario-admin').then(
        (m) => m.CrearUsuarioAdmin
      ),
    title: 'Usuarios',
  },
  {
    path: 'detalles-usuario-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/usuario/pages/detalles-usuario-admin/detalles-usuario-admin').then(
        (m) => m.DetallesUsuarioAdmin
      ),
    title: 'Usuarios',
  },
  {
    path: 'detalles-curso-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/curso/pages/detalles-curso-admin/detalles-curso-admin').then(
        (m) => m.DetallesCursoAdmin
      ),
    title: 'Cursos',
  },
  {
    path: 'ver-conductores-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/conductor/pages/ver-conductores-admin/ver-conductores-admin').then(
        (m) => m.VerConductoresAdmin
      ),
    title: 'Conductores',
  },
  {
    path: 'crear-conductor-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/conductor/pages/crear-conductor-admin/crear-conductor-admin').then(
        (m) => m.CrearConductorAdmin
      ),
    title: 'Conductores',
  },
  {
    path: 'detalles-conductor-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import(
        './features/admin/conductor/pages/detalles-conductor-admin/detalles-conductor-admin'
      ).then((m) => m.DetallesConductorAdmin),
    title: 'Conductores',
  },
  {
    path: 'detalles-login-admin/:id',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/login/pages/detalles-login-admin/detalles-login-admin').then(
        (m) => m.DetallesLoginAdmin
      ),
    title: 'logins',
  },
  {
    path: 'ver-alarmas-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/alarma/pages/ver-alarmas-admin/ver-alarmas-admin').then(
        (m) => m.VerAlarmasAdmin
      ),
    title: 'alarmas',
  },
  {
    path: 'ver-perfil-admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/perfil/pages/ver-perfil-admin/ver-perfil-admin').then(
        (m) => m.VerPerfilAdmin
      ),
    title: 'perfil',
  },

  {
    path: 'dashboard-operador',
    canActivate: [authGuard],
    data: { roles: ['OPERADOR'] },
    loadComponent: () =>
      import('./features/operador/dashboard/pages/inicio/inicio').then((m) => m.Inicio),
    title: 'Dashboard',
  },
  {
    path: 'ver-maquinarias-operador',
    canActivate: [authGuard],
    data: { roles: ['OPERADOR'] },
    loadComponent: () =>
      import(
        './features/operador/maquinaria/pages/ver-maquinarias-operador/ver-maquinarias-operador'
      ).then((m) => m.VerMaquinariasOperador),
    title: 'Maquinaria',
  },
  {
    path: 'detalles-maquinaria-operador/:id',
    canActivate: [authGuard],
    data: { roles: ['OPERADOR'] },
    loadComponent: () =>
      import(
        './features/operador/maquinaria/pages/detalles-maquinaria-operador/detalles-maquinaria-operador'
      ).then((m) => m.DetallesMaquinariaOperador),
    title: 'Maquinaria',
  },
  {
    path: 'ver-registros-horas-maquinaria-operador',
    canActivate: [authGuard],
    data: { roles: ['OPERADOR'] },
    loadComponent: () =>
      import(
        './features/operador/registro-horas-maquinaria/pages/ver-registros-horas-maquinaria-operador/ver-registros-horas-maquinaria-operador'
      ).then((m) => m.VerRegistrosHorasMaquinariaOperador),
    title: 'Registro Horas Maquinaria',
  },
  {
    path: 'crear-registro-horas-maquinaria-operador',
    canActivate: [authGuard],
    data: { roles: ['OPERADOR'] },
    loadComponent: () =>
      import(
        './features/operador/registro-horas-maquinaria/pages/crear-registro-horas-maquinaria-operador/crear-registro-horas-maquinaria-operador'
      ).then((m) => m.CrearRegistroHorasMaquinariaOperador),
    title: 'Registro Horas Maquinaria',
  },
  {
    path: 'detalles-registro-horas-maquinaria-operador/:id',
    canActivate: [authGuard],
    data: { roles: ['OPERADOR'] },
    loadComponent: () =>
      import(
        './features/operador/registro-horas-maquinaria/pages/detalles-registro-horas-maquinaria-operador/detalles-registro-horas-maquinaria-operador'
      ).then((m) => m.DetallesRegistroHorasMaquinariaOperador),
    title: 'Registro Horas Maquinaria',
  },
  {
    path: 'detalles-mantenimiento-programado-operador/:id',
    canActivate: [authGuard],
    data: { roles: ['OPERADOR'] },
    loadComponent: () =>
      import(
        './features/operador/mantenimiento-programado/pages/detalles-mantenimiento-programado-operador/detalles-mantenimiento-programado-operador'
      ).then((m) => m.DetallesMantenimientoProgramadoOperador),
    title: 'Mantenimiento Programado',
  },
  {
    path: 'ver-perfil-operador',
    canActivate: [authGuard],
    data: { roles: ['OPERADOR'] },
    loadComponent: () =>
      import('./features/operador/perfil/pages/ver-perfil-operador/ver-perfil-operador').then(
        (m) => m.VerPerfilOperador
      ),
    title: 'Perfil',
  },
  {
    path: 'ver-alarmas-operador',
    canActivate: [authGuard],
    data: { roles: ['OPERADOR'] },
    loadComponent: () =>
      import('./features/operador/alarma/pages/ver-alarmas-operador/ver-alarmas-operador').then(
        (m) => m.VerAlarmasOperador
      ),
    title: 'Alarmas',
  },

  {
    path: 'dashboard-responsable',
    canActivate: [authGuard],
    data: { roles: ['RESPONSABLE_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import('./features/responsable/dashboard/pages/inicio/inicio').then((m) => m.Inicio),
    title: 'Dashboard',
  },
  {
    path: 'ver-maquinarias-responsable',
    canActivate: [authGuard],
    data: { roles: ['RESPONSABLE_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/responsable/maquinaria/pages/ver-maquinarias-responsable/ver-maquinarias-responsable'
      ).then((m) => m.VerMaquinariasResponsable),
    title: 'Maquinaria',
  },
  {
    path: 'detalles-maquinaria-responsable/:id',
    canActivate: [authGuard],
    data: { roles: ['RESPONSABLE_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/responsable/maquinaria/pages/detalles-maquinaria-responsable/detalles-maquinaria-responsable'
      ).then((m) => m.DetallesMaquinariaResponsable),
    title: 'Maquinaria',
  },
  {
    path: 'detalles-mantenimiento-programado-responsable/:id',
    canActivate: [authGuard],
    data: { roles: ['RESPONSABLE_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/responsable/mantenimiento-programado/pages/detalles-mantenimiento-programado-responsable/detalles-mantenimiento-programado-responsable'
      ).then((m) => m.DetallesMantenimientoProgramadoResponsable),
    title: 'Mantenimiento Programado',
  },
  {
    path: 'ver-mantenimientos-responsable',
    canActivate: [authGuard],
    data: { roles: ['RESPONSABLE_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/responsable/mantenimiento/pages/ver-mantenimientos-responsable/ver-mantenimientos-responsable'
      ).then((m) => m.VerMantenimientosResponsable),
    title: 'Mantenimiento Programado',
  },
  {
    path: 'detalles-mantenimiento-responsable/:id',
    canActivate: [authGuard],
    data: { roles: ['RESPONSABLE_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/responsable/mantenimiento/pages/detalles-mantenimiento-responsable/detalles-mantenimiento-responsable'
      ).then((m) => m.DetallesMantenimientoResponsable),
    title: 'Mantenimiento Programado',
  },
  {
    path: 'ver-perfil-responsable',
    canActivate: [authGuard],
    data: { roles: ['RESPONSABLE_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/responsable/perfil/pages/ver-perfil-responsable/ver-perfil-responsable'
      ).then((m) => m.VerPerfilResponsable),
    title: 'Perfil',
  },
  {
    path: 'ver-alarmas-responsable',
    canActivate: [authGuard],
    data: { roles: ['RESPONSABLE_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/responsable/alarma/pages/ver-alarmas-responsable/ver-alarmas-responsable'
      ).then((m) => m.VerAlarmasResponsable),
    title: 'Alarmas',
  },

  {
    path: 'dashboard-tecnico',
    canActivate: [authGuard],
    data: { roles: ['TECNICO_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import('./features/tecnico/dashboard/pages/inicio/inicio').then((m) => m.Inicio),
    title: 'Dashboard',
  },
  {
    path: 'ver-maquinarias-tecnico',
    canActivate: [authGuard],
    data: { roles: ['TECNICO_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/tecnico/maquinaria/pages/ver-maquinarias-tecnico/ver-maquinarias-tecnico'
      ).then((m) => m.VerMaquinariasTecnico),
    title: 'Maquinaria',
  },
  {
    path: 'detalles-maquinaria-tecnico/:id',
    canActivate: [authGuard],
    data: { roles: ['TECNICO_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/tecnico/maquinaria/pages/detalles-maquinaria-tecnico/detalles-maquinaria-tecnico'
      ).then((m) => m.DetallesMaquinariaTecnico),
    title: 'Maquinaria',
  },
  {
    path: 'detalles-mantenimiento-programado-tecnico/:id',
    canActivate: [authGuard],
    data: { roles: ['TECNICO_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/tecnico/mantenimiento-programado/pages/detalles-mantenimiento-programado-tecnico/detalles-mantenimiento-programado-tecnico'
      ).then((m) => m.DetallesMantenimientoProgramadoTecnico),
    title: 'Mantenimiento Programado',
  },
  {
    path: 'ver-mantenimientos-tecnico',
    canActivate: [authGuard],
    data: { roles: ['TECNICO_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/tecnico/mantenimiento/pages/ver-mantenimientos-tecnico/ver-mantenimientos-tecnico'
      ).then((m) => m.VerMantenimientosTecnico),
    title: 'Mantenimiento Programado',
  },
  {
    path: 'crear-mantenimiento-tecnico',
    canActivate: [authGuard],
    data: { roles: ['TECNICO_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/tecnico/mantenimiento/pages/crear-mantenimiento-tecnico/crear-mantenimiento-tecnico'
      ).then((m) => m.CrearMantenimientoTecnico),
    title: 'Mantenimiento Programado',
  },
  {
    path: 'detalles-mantenimiento-tecnico/:id',
    canActivate: [authGuard],
    data: { roles: ['TECNICO_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import(
        './features/tecnico/mantenimiento/pages/detalles-mantenimiento-tecnico/detalles-mantenimiento-tecnico'
      ).then((m) => m.DetallesMantenimientoTecnico),
    title: 'Mantenimiento Programado',
  },
  {
    path: 'ver-perfil-tecnico',
    canActivate: [authGuard],
    data: { roles: ['TECNICO_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import('./features/tecnico/perfil/pages/ver-perfil-tecnico/ver-perfil-tecnico').then(
        (m) => m.VerPerfilTecnico
      ),
    title: 'Perfil',
  },
  {
    path: 'ver-alarmas-tecnico',
    canActivate: [authGuard],
    data: { roles: ['TECNICO_DE_MANTENIMIENTO'] },
    loadComponent: () =>
      import('./features/tecnico/alarma/pages/ver-alarmas-tecnico/ver-alarmas-tecnico').then(
        (m) => m.VerAlarmasTecnico
      ),
    title: 'Alarmas',
  },
];
