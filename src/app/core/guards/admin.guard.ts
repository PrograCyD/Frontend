/**
 * AdminGuard - Guard de Rol Admin
 *
 * Protege rutas que requieren rol de administrador.
 * Si el usuario no es admin, redirige a la página principal o muestra error.
 *
 * IMPORTANTE: Este guard debe usarse JUNTO con authGuard:
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard, adminGuard]  // ← Orden importante
 * }
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado Y es admin
  if (authService.isAuthenticatedUser() && authService.isAdminUser()) {
    return true;
  }

  // Si está autenticado pero no es admin
  if (authService.isAuthenticatedUser()) {
    console.warn('Acceso denegado. Se requiere rol de administrador.');

    // Opcional: redirigir a página de acceso denegado
    router.navigate(['/'], {
      queryParams: {
        error: 'access-denied',
        message: 'Se requieren privilegios de administrador'
      }
    });

    return false;
  }

  // Si no está autenticado, redirigir a login
  console.warn('Usuario no autenticado. Redirigiendo a login...');
  router.navigate(['/login'], {
    queryParams: {
      returnUrl: state.url,
      reason: 'admin-access-required'
    }
  });

  return false;
};
