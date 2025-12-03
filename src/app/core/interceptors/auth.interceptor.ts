/**
 * AuthInterceptor - Interceptor de Autenticación
 *
 * Intercepta todas las peticiones HTTP y añade automáticamente
 * el token JWT en el header Authorization si existe.
 *
 * Formato: Authorization: Bearer <token>
 *
 * El token se obtiene del localStorage donde AuthService lo guardó.
 */

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener token del localStorage
  const token = localStorage.getItem('token');

  // Si existe token, clonar la request y añadir el header
  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(clonedRequest);
  }

  // Si no hay token, continuar con la request original
  return next(req);
};
