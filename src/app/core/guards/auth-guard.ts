import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { LoginRol } from '../models/auth.models';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles: LoginRol[] = route.data['roles'];

  if (expectedRoles && expectedRoles.length > 0) {
    const hasRol = expectedRoles.some((rol) => rol === authService.obtenerRol());

    if (!hasRol) {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
