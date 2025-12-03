/**
 * ErrorInterceptor - Interceptor de Manejo de Errores
 *
 * Intercepta todas las respuestas HTTP y maneja errores comunes:
 *
 * - 401 Unauthorized: Token inválido o expirado → Logout y redirigir a login
 * - 403 Forbidden: Sin permisos → Mostrar mensaje de error
 * - 404 Not Found: Recurso no encontrado
 * - 500 Server Error: Error del servidor
 *
 * También puede mostrar notificaciones al usuario (cuando se implemente el servicio).
 */

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      // Manejar diferentes tipos de errores
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
        console.error('Client-side error:', error.error.message);
      } else {
        // Error del lado del servidor
        errorMessage = `Error ${error.status}: ${error.message}`;
        console.error(`Server-side error: ${error.status}`, error.message);

        // Manejar códigos de estado específicos
        switch (error.status) {
          case 401:
            // Token inválido o expirado
            console.warn('Sesión expirada o inválida. Redirigiendo a login...');
            localStorage.clear();
            router.navigate(['/login'], {
              queryParams: { returnUrl: router.url, reason: 'session-expired' }
            });
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
            break;

          case 403:
            // Sin permisos
            console.warn('Acceso denegado. Permisos insuficientes.');
            errorMessage = 'No tienes permisos para acceder a este recurso.';
            // Opcional: redirigir a página de acceso denegado
            // router.navigate(['/access-denied']);
            break;

          case 404:
            // Recurso no encontrado
            console.warn('Recurso no encontrado:', req.url);
            errorMessage = 'El recurso solicitado no existe.';
            break;

          case 500:
            // Error del servidor
            console.error('Error interno del servidor');
            errorMessage = 'Error del servidor. Por favor, intenta nuevamente más tarde.';
            break;

          case 503:
            // Servicio no disponible
            console.error('Servicio no disponible');
            errorMessage = 'El servicio no está disponible en este momento.';
            break;

          default:
            // Otros errores
            errorMessage = error.error?.message || error.message || 'Error desconocido';
        }
      }

      // Opcional: Mostrar notificación al usuario
      // const notificationService = inject(NotificationService);
      // notificationService.error(errorMessage);

      // Re-lanzar el error para que el componente pueda manejarlo si lo necesita
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error
      }));
    })
  );
};
