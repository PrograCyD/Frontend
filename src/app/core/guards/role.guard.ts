/**
 * RoleGuard Factory - Guard Genérico de Roles
 *
 * Permite crear guards dinámicos para diferentes roles.
 * Más flexible que tener un guard por cada rol.
 *
 * Uso en rutas:
 * {
 *   path: 'moderator',
 *   component: ModeratorComponent,
 *   canActivate: [createRoleGuard(['admin', 'moderator'])]
 * }
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Factory para crear guards de roles personalizados
 */
export function createRoleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificar autenticación
    if (!authService.isAuthenticatedUser()) {
      console.warn('Usuario no autenticado.');
      router.navigate(['/login']);
      return false;
    }

    // Verificar rol
    const currentUser = authService.currentUser();
    const userRole = currentUser?.role;

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Rol no permitido
    console.warn(`Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`);
    router.navigate(['/'], {
      queryParams: {
        error: 'insufficient-permissions',
        required: allowedRoles.join(',')
      }
    });

    return false;
  };
}
