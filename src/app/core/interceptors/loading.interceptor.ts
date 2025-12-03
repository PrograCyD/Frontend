/**
 * LoadingInterceptor - Interceptor de Estado de Carga
 *
 * Intercepta todas las peticiones HTTP y actualiza un servicio global
 * de loading para mostrar/ocultar un spinner o barra de progreso.
 *
 * OPCIONAL: Descomentar cuando se implemente LoadingService
 */

import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // const loadingService = inject(LoadingService);

  // Incrementar contador de peticiones activas
  // loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Decrementar contador cuando la petición termine
      // loadingService.hide();
    })
  );
};

/**
 * NOTA: Para usar este interceptor necesitas crear LoadingService:
 *
 * @Injectable({ providedIn: 'root' })
 * export class LoadingService {
 *   private loadingSubject = new BehaviorSubject<boolean>(false);
 *   loading$ = this.loadingSubject.asObservable();
 *   private requestCount = 0;
 *
 *   show() {
 *     this.requestCount++;
 *     this.loadingSubject.next(true);
 *   }
 *
 *   hide() {
 *     this.requestCount--;
 *     if (this.requestCount <= 0) {
 *       this.requestCount = 0;
 *       this.loadingSubject.next(false);
 *     }
 *   }
 * }
 */
