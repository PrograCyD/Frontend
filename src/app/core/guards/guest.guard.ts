/**
 * GuestGuard - Guard para Usuarios No Autenticados
 *
 * Protege rutas que solo deben ser accesibles para usuarios NO autenticados.
 * Por ejemplo: login, register.
 *
 * Si el usuario ya está autenticado, redirige a la página principal.
 *
 * Uso en rutas:
 * {
 *   path: 'login',
 *   component: LoginComponent,
 *   canActivate: [guestGuard]
 * }
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario NO está autenticado, permitir acceso
  if (!authService.isAuthenticatedUser()) {
    return true;
  }

  // Si ya está autenticado, redirigir a la página principal
  console.log('Usuario ya autenticado. Redirigiendo a home...');
  router.navigate(['/home']);

  return false;
};
