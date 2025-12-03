/**
 * RatingService - Servicio de Calificaciones
 *
 * Endpoints del backend:
 * - GET /me/ratings - Obtener mis ratings (usuario autenticado)
 * - POST /me/ratings - Crear/actualizar rating (usuario autenticado)
 * - GET /users/{id}/ratings - Obtener ratings de usuario específico (admin)
 * - POST /users/{id}/ratings - Crear rating para usuario (admin)
 *
 * MOCK MODE: Actualmente usa datos simulados.
 * Para activar API real: environment.mockData = false
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Rating,
  CreateRatingRequest,
  UserRatingsResponse
} from '../models';
import { mockRatings, getRatingsByUser } from '../data/mock-ratings';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly API_URL = environment.apiUrl;

  // Mock database - inicializado con datos reales de mock-ratings.ts
  private mockRatingsData: Rating[] = [...mockRatings];

  constructor(private http: HttpClient) {}

  /**
   * Obtener mis ratings
   * Backend: GET /me/ratings
   */
  getMyRatings(): Observable<UserRatingsResponse> {
    if (environment.mockData) {
      return this.mockGetMyRatings();
    }

    // REAL API
    return this.http.get<UserRatingsResponse>(`${this.API_URL}/me/ratings`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Crear o actualizar mi rating
   * Backend: POST /me/ratings
   */
  createMyRating(request: CreateRatingRequest): Observable<Rating> {
    if (environment.mockData) {
      return this.mockCreateMyRating(request);
    }

    // REAL API
    return this.http.post<Rating>(`${this.API_URL}/me/ratings`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener ratings de un usuario específico (admin)
   * Backend: GET /users/{id}/ratings
   */
  getUserRatings(userId: number): Observable<UserRatingsResponse> {
    if (environment.mockData) {
      return this.mockGetUserRatings(userId);
    }

    // REAL API
    return this.http.get<UserRatingsResponse>(`${this.API_URL}/users/${userId}/ratings`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Crear rating para un usuario específico (admin)
   * Backend: POST /users/{id}/ratings
   */
  createUserRating(userId: number, request: CreateRatingRequest): Observable<Rating> {
    if (environment.mockData) {
      return this.mockCreateUserRating(userId, request);
    }

    // REAL API
    return this.http.post<Rating>(`${this.API_URL}/users/${userId}/ratings`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Eliminar un rating (si el backend lo implementa)
   */
  deleteRating(movieId: number): Observable<void> {
    if (environment.mockData) {
      return this.mockDeleteRating(movieId);
    }

    // REAL API (si existe en el backend)
    return this.http.delete<void>(`${this.API_URL}/me/ratings/${movieId}`)
      .pipe(catchError(this.handleError));
  }

  // ============================================
  // MOCK METHODS
  // ============================================

  private mockGetMyRatings(): Observable<UserRatingsResponse> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const currentUserId = parseInt(localStorage.getItem('userId') || '1');
        const userRatings = this.mockRatingsData.filter(r => r.userId === currentUserId);

        return {
          ratings: userRatings,
          total: userRatings.length
        };
      })
    );
  }

  private mockCreateMyRating(request: CreateRatingRequest): Observable<Rating> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const currentUserId = parseInt(localStorage.getItem('userId') || '1');

        // Validar rating
        if (request.rating < 0.5 || request.rating > 5.0) {
          throw { error: 'Rating must be between 0.5 and 5.0', status: 400 };
        }

        if (request.rating % 0.5 !== 0) {
          throw { error: 'Rating must be in increments of 0.5', status: 400 };
        }

        // Buscar si ya existe un rating para esta película
        const existingIndex = this.mockRatingsData.findIndex(
          r => r.userId === currentUserId && r.movieId === request.movieId
        );

        const newRating: Rating = {
          userId: currentUserId,
          movieId: request.movieId,
          rating: request.rating,
          timestamp: Math.floor(Date.now() / 1000)
        };

        if (existingIndex >= 0) {
          // Actualizar rating existente
          this.mockRatingsData[existingIndex] = newRating;
        } else {
          // Crear nuevo rating
          this.mockRatingsData.push(newRating);
        }

        return newRating;
      }),
      catchError(err => throwError(() => err))
    );
  }

  private mockGetUserRatings(userId: number): Observable<UserRatingsResponse> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const userRatings = this.mockRatingsData.filter(r => r.userId === userId);

        return {
          ratings: userRatings,
          total: userRatings.length
        };
      })
    );
  }

  private mockCreateUserRating(userId: number, request: CreateRatingRequest): Observable<Rating> {
    return of(null).pipe(
      delay(300),
      map(() => {
        // Validar rating
        if (request.rating < 0.5 || request.rating > 5.0) {
          throw { error: 'Rating must be between 0.5 and 5.0', status: 400 };
        }

        const existingIndex = this.mockRatingsData.findIndex(
          r => r.userId === userId && r.movieId === request.movieId
        );

        const newRating: Rating = {
          userId,
          movieId: request.movieId,
          rating: request.rating,
          timestamp: Math.floor(Date.now() / 1000)
        };

        if (existingIndex >= 0) {
          this.mockRatingsData[existingIndex] = newRating;
        } else {
          this.mockRatingsData.push(newRating);
        }

        return newRating;
      }),
      catchError(err => throwError(() => err))
    );
  }

  private mockDeleteRating(movieId: number): Observable<void> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const currentUserId = parseInt(localStorage.getItem('userId') || '1');
        const index = this.mockRatingsData.findIndex(
          r => r.userId === currentUserId && r.movieId === movieId
        );

        if (index >= 0) {
          this.mockRatingsData.splice(index, 1);
        }
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('RatingService Error:', error);
    return throwError(() => error);
  }
}
