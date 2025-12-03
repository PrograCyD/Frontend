/**
 * RecommendationService - Servicio de Recomendaciones
 *
 * Endpoints del backend:
 * - GET /me/recommendations - Obtener mis recomendaciones (usuario autenticado)
 * - GET /users/{id}/recommendations - Obtener recomendaciones de usuario (admin)
 * - GET /users/{id}/ws/recommendations - WebSocket para recomendaciones en tiempo real (admin)
 *
 * MOCK MODE: Actualmente usa datos simulados.
 * Para activar API real: environment.mockData = false
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, throwError, timer } from 'rxjs';
import { map, catchError, concatMap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Recommendation,
  RecommendationResponse,
  RecommendationParams,
  WSMessage
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private readonly API_URL = environment.apiUrl;
  private ws?: WebSocket;

  constructor(private http: HttpClient) {}

  /**
   * Obtener mis recomendaciones
   * Backend: GET /me/recommendations?k=20&refresh=false
   */
  getMyRecommendations(params?: RecommendationParams): Observable<RecommendationResponse> {
    if (environment.mockData) {
      return this.mockGetMyRecommendations(params);
    }

    // REAL API
    let httpParams = new HttpParams();
    if (params?.k) httpParams = httpParams.set('k', params.k.toString());
    if (params?.refresh !== undefined) {
      httpParams = httpParams.set('refresh', params.refresh.toString());
    }

    return this.http.get<RecommendationResponse>(
      `${this.API_URL}/me/recommendations`,
      { params: httpParams }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Obtener recomendaciones de usuario específico (admin)
   * Backend: GET /users/{id}/recommendations?k=20
   */
  getUserRecommendations(userId: number, params?: RecommendationParams): Observable<RecommendationResponse> {
    if (environment.mockData) {
      return this.mockGetUserRecommendations(userId, params);
    }

    // REAL API
    let httpParams = new HttpParams();
    if (params?.k) httpParams = httpParams.set('k', params.k.toString());
    if (params?.refresh !== undefined) {
      httpParams = httpParams.set('refresh', params.refresh.toString());
    }

    return this.http.get<RecommendationResponse>(
      `${this.API_URL}/users/${userId}/recommendations`,
      { params: httpParams }
    ).pipe(catchError(this.handleError));
  }

  /**
   * WebSocket para recomendaciones en tiempo real (admin)
   * Backend: WS /users/{id}/ws/recommendations?k=20
   */
  connectRecommendationWS(userId: number, k: number = 20): Observable<WSMessage> {
    if (environment.mockData) {
      return this.mockConnectRecommendationWS(userId, k);
    }

    // REAL API
    return new Observable(observer => {
      const token = localStorage.getItem('token');
      const wsUrl = `${environment.wsUrl}/users/${userId}/ws/recommendations?k=${k}`;

      this.ws = new WebSocket(wsUrl);

      // Agregar token en el primer mensaje si es necesario
      this.ws.onopen = () => {
        console.log('WebSocket conectado');
        if (token) {
          this.ws?.send(JSON.stringify({ type: 'auth', token }));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          observer.next(message);

          // Si es el mensaje final, completar
          if (message.type === 'recommendations' || message.type === 'error') {
            observer.complete();
          }
        } catch (error) {
          observer.error(error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        observer.error(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket cerrado');
        observer.complete();
      };

      // Cleanup al desuscribirse
      return () => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.close();
        }
      };
    });
  }

  /**
   * Cerrar conexión WebSocket si está abierta
   */
  closeWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  // ============================================
  // MOCK METHODS
  // ============================================

  private mockGetMyRecommendations(params?: RecommendationParams): Observable<RecommendationResponse> {
    const k = params?.k || 20;
    const refresh = params?.refresh || false;

    return of(null).pipe(
      delay(refresh ? 2000 : 500), // Más delay si se fuerza refresh
      map(() => {
        const currentUserId = parseInt(localStorage.getItem('userId') || '1');

        return {
          userId: currentUserId,
          items: this.generateMockRecommendations(k, currentUserId),
          generatedAt: new Date().toISOString(),
          fromCache: !refresh,
          algorithm: 'item-based-collaborative-filtering'
        };
      })
    );
  }

  private mockGetUserRecommendations(userId: number, params?: RecommendationParams): Observable<RecommendationResponse> {
    const k = params?.k || 20;

    return of(null).pipe(
      delay(1500),
      map(() => ({
        userId,
        items: this.generateMockRecommendations(k, userId),
        generatedAt: new Date().toISOString(),
        fromCache: false,
        algorithm: 'item-based-collaborative-filtering'
      }))
    );
  }

  private mockConnectRecommendationWS(userId: number, k: number): Observable<WSMessage> {
    const messages: WSMessage[] = [
      {
        type: 'start',
        msg: 'Conexión WebSocket abierta, iniciando cálculo de recomendaciones...'
      },
      {
        type: 'progress',
        msg: 'Consultando nodo ML 1/4 (shard 1)...',
        progress: 25,
        nodeId: '1'
      },
      {
        type: 'progress',
        msg: 'Consultando nodo ML 2/4 (shard 2)...',
        progress: 50,
        nodeId: '2'
      },
      {
        type: 'progress',
        msg: 'Consultando nodo ML 3/4 (shard 3)...',
        progress: 75,
        nodeId: '3'
      },
      {
        type: 'progress',
        msg: 'Consultando nodo ML 4/4 (shard 4)...',
        progress: 100,
        nodeId: '4'
      },
      {
        type: 'recommendations',
        userId,
        items: this.generateMockRecommendations(k, userId),
        generatedAt: new Date().toISOString()
      }
    ];

    // Emitir mensajes con delay progresivo
    return new Observable(observer => {
      let index = 0;

      const emitNext = () => {
        if (index < messages.length) {
          observer.next(messages[index]);
          index++;

          if (index < messages.length) {
            setTimeout(emitNext, 700); // 700ms entre mensajes
          } else {
            observer.complete();
          }
        }
      };

      // Iniciar después de un pequeño delay
      setTimeout(emitNext, 500);

      // Cleanup
      return () => {
        console.log('Mock WebSocket: Limpiando subscripción');
      };
    });
  }

  private generateMockRecommendations(k: number, userId: number): Recommendation[] {
    const movieTitles = [
      'The Shawshank Redemption', 'The Godfather', 'The Dark Knight',
      'Pulp Fiction', 'Forrest Gump', 'Inception', 'The Matrix',
      'Goodfellas', 'The Silence of the Lambs', 'Interstellar',
      'The Green Mile', 'Parasite', 'Gladiator', 'The Prestige',
      'The Departed', 'Whiplash', 'The Lion King', 'Back to the Future',
      'The Pianist', 'Django Unchained', 'WALL·E', 'Avengers: Endgame',
      'Coco', 'Spirited Away', 'Joker', 'The Intouchables'
    ];

    const reasons = [
      'Based on movies you rated highly',
      'Similar to films you enjoyed',
      'Recommended for your taste profile',
      'Popular among users with similar preferences',
      'Matches your favorite genres',
      'Trending in your category'
    ];

    return Array.from({ length: Math.min(k, movieTitles.length) }, (_, i) => {
      const movieId = (userId * 100) + i + 1;
      const score = 0.95 - (i * 0.03);

      return {
        movieId,
        score: Math.max(0.5, score),
        title: movieTitles[i % movieTitles.length],
        reason: reasons[i % reasons.length],
        posterUrl: `https://image.tmdb.org/t/p/w500/mock-rec-${movieId}.jpg`,
        genres: this.getRandomGenres(),
        voteAverage: 7.0 + Math.random() * 2.5
      };
    });
  }

  private getRandomGenres(): string[] {
    const allGenres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Romance'];
    const count = 2 + Math.floor(Math.random() * 2);
    return allGenres.sort(() => Math.random() - 0.5).slice(0, count);
  }

  private handleError(error: any): Observable<never> {
    console.error('RecommendationService Error:', error);
    return throwError(() => error);
  }
}
