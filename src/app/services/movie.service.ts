/**
 * MovieService - Servicio de Películas
 *
 * Endpoints del backend:
 * - GET /movies/{id} - Obtener película por ID
 * - GET /movies/search - Búsqueda de películas con filtros
 * - GET /movies/top - Top películas por popularidad
 *
 * MOCK MODE: Actualmente usa datos simulados.
 * Para activar API real: environment.mockData = false
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Movie,
  MovieExtended,
  MovieSearchParams,
  MovieSearchResponse,
  TopMoviesParams,
  MovieHelpers
} from '../models';
import { mockMovies } from '../data/mock-movies';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly API_URL = environment.apiUrl;

  // Mock database de películas
  private mockMoviesData: MovieExtended[] = mockMovies;

  constructor(private http: HttpClient) {}


  /**
   * Obtener película por ID
   * Backend: GET /movies/{id}
   */
  getMovie(id: number): Observable<Movie> {
    if (environment.mockData) {
      return this.mockGetMovie(id);
    }

    // REAL API
    return this.http.get<Movie>(`${this.API_URL}/movies/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Buscar películas con filtros
   * Backend: GET /movies/search
   */
  searchMovies(params: MovieSearchParams): Observable<MovieSearchResponse> {
    if (environment.mockData) {
      return this.mockSearchMovies(params);
    }

    // REAL API
    let httpParams = new HttpParams();
    if (params.query) httpParams = httpParams.set('query', params.query);
    if (params.genres && params.genres.length > 0) {
      httpParams = httpParams.set('genres', params.genres.join(','));
    }
    if (params.minRating) httpParams = httpParams.set('minRating', params.minRating.toString());
    if (params.yearFrom) httpParams = httpParams.set('yearFrom', params.yearFrom.toString());
    if (params.yearTo) httpParams = httpParams.set('yearTo', params.yearTo.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.offset) httpParams = httpParams.set('offset', params.offset.toString());

    return this.http.get<MovieSearchResponse>(`${this.API_URL}/movies/search`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener top películas
   * Backend: GET /movies/top
   */
  getTopMovies(params?: TopMoviesParams): Observable<Movie[]> {
    if (environment.mockData) {
      return this.mockGetTopMovies(params);
    }

    // REAL API
    let httpParams = new HttpParams();
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset) httpParams = httpParams.set('offset', params.offset.toString());
    if (params?.genre) httpParams = httpParams.set('genre', params.genre);

    return this.http.get<Movie[]>(`${this.API_URL}/movies/top`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  // ============================================
  // MOCK METHODS
  // ============================================

  private mockGetMovie(id: number): Observable<Movie> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const movie = this.mockMoviesData.find(m => m.movieId === id);
        if (!movie) {
          throw { error: 'Movie not found', status: 404 };
        }
        return movie;
      }),
      catchError(err => throwError(() => err))
    );
  }

  private mockSearchMovies(params: MovieSearchParams): Observable<MovieSearchResponse> {
    return of(null).pipe(
      delay(500),
      map(() => {
        let results = [...this.mockMoviesData];

        // Filtrar por query (título)
        if (params.query) {
          const query = params.query.toLowerCase();
          results = results.filter(m =>
            m.title.toLowerCase().includes(query)
          );
        }

        // Filtrar por géneros
        if (params.genres && params.genres.length > 0) {
          results = results.filter(m =>
            m.genres.some(g => params.genres!.includes(g))
          );
        }

        // Filtrar por rating mínimo (usar ratingStats.average)
        if (params.minRating && params.minRating > 0) {
          results = results.filter(m =>
            (MovieHelpers.getAverageRating(m) || 0) >= params.minRating!
          );
        }

        // Filtrar por año
        if (params.yearFrom || params.yearTo) {
          results = results.filter(m => {
            if (!m.year) return false;
            const year = m.year;
            if (params.yearFrom && year < params.yearFrom) return false;
            if (params.yearTo && year > params.yearTo) return false;
            return true;
          });
        }

        // Ordenar por popularidad
        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        const total = results.length;
        const offset = params.offset || 0;
        const limit = params.limit || 20;

        // Paginación
        results = results.slice(offset, offset + limit);

        return {
          movies: results,
          total,
          limit,
          offset
        };
      })
    );
  }

  private mockGetTopMovies(params?: TopMoviesParams): Observable<Movie[]> {
    return of(null).pipe(
      delay(400),
      map(() => {
        let results = [...this.mockMoviesData];

        // Filtrar por género si se especifica
        if (params?.genre) {
          results = results.filter(m => m.genres.includes(params.genre!));
        }

        // Ordenar por popularidad
        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        const offset = params?.offset || 0;
        const limit = params?.limit || 20;

        return results.slice(offset, offset + limit);
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('MovieService Error:', error);
    return throwError(() => error);
  }
}
