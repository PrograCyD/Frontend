import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import {
  Rating,
  CreateRatingRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtener MIS ratings
   * Backend: GET /me/ratings
   * Respuesta real: Rating[]
   */
  getMyRatings(): Observable<Rating[]> {
    console.log('[RatingService] GET /me/ratings');
    return this.http
      .get<Rating[]>(`${this.API_URL}/me/ratings`)
      .pipe(
        tap((ratings) =>
          console.log('[RatingService] /me/ratings respuesta:', ratings)
        ),
        catchError(this.handleError)
      );
  }

  /**
   * Crear o actualizar MI rating
   * Backend: POST /me/ratings (204 No Content)
   */
  createMyRating(request: CreateRatingRequest): Observable<Rating> {
    console.log('[RatingService] POST /me/ratings', request);

    return this.http
      .post<void>(`${this.API_URL}/me/ratings`, request)
      .pipe(
        map(() => {
          const currentUserId = parseInt(
            localStorage.getItem('userId') || '0',
            10
          );

          const newRating: Rating = {
            userId: currentUserId,
            movieId: request.movieId,
            rating: request.rating,
            timestamp: Math.floor(Date.now() / 1000)
          };

          console.log('[RatingService] Rating reconstruido local:', newRating);
          return newRating;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener ratings de un usuario específico (ADMIN)
   * Backend: GET /users/{id}/ratings
   * Respuesta real: Rating[]
   */
  getUserRatings(userId: number): Observable<Rating[]> {
    console.log('[RatingService] GET /users/' + userId + '/ratings');
    return this.http
      .get<Rating[]>(`${this.API_URL}/users/${userId}/ratings`)
      .pipe(
        tap((ratings) =>
          console.log(
            `[RatingService] /users/${userId}/ratings respuesta:`,
            ratings
          )
        ),
        catchError(this.handleError)
      );
  }

  /**
   * Crear rating para un usuario específico (ADMIN)
   * Backend: POST /users/{id}/ratings (204 No Content)
   */
  createUserRating(
    userId: number,
    request: CreateRatingRequest
  ): Observable<Rating> {
    console.log(
      `[RatingService] POST /users/${userId}/ratings`,
      request
    );

    return this.http
      .post<void>(`${this.API_URL}/users/${userId}/ratings`, request)
      .pipe(
        map(() => {
          const newRating: Rating = {
            userId,
            movieId: request.movieId,
            rating: request.rating,
            timestamp: Math.floor(Date.now() / 1000)
          };
          console.log(
            '[RatingService] Rating reconstruido local (admin):',
            newRating
          );
          return newRating;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar un rating
   * Backend: DELETE /me/ratings/{movieId}
   */
  deleteRating(movieId: number): Observable<void> {
    console.log('[RatingService] DELETE /me/ratings/' + movieId);
    return this.http
      .delete<void>(`${this.API_URL}/me/ratings/${movieId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('RatingService Error:', error);
    return throwError(() => error);
  }
}
