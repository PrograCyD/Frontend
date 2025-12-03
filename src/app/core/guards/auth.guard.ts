/**
 * AuthGuard - Guard de Autenticación
 *
 * Protege rutas que requieren que el usuario esté autenticado.
 * Si el usuario no está autenticado, redirige al login.
 *
 * Uso en rutas:
 * {
 *   path: 'protected',
 *   component: ProtectedComponent,
 *   canActivate: [authGuard]
 * }
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (authService.isAuthenticatedUser()) {
    return true;
  }

  // Si no está autenticado, guardar la URL solicitada y redirigir al login
  console.warn('Usuario no autenticado. Redirigiendo a login...');

  router.navigate(['/login'], {
    queryParams: {
      returnUrl: state.url,
      reason: 'authentication-required'
    }
  });

  return false;
};
