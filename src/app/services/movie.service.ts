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
  MovieHelpers,
  MovieTmdbPrefill,
  MovieCreateUpdateRequest,
  ExternalData
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

  // =====================================================
  // ENDPOINTS REALES
  // =====================================================

  /**
   * GET /movies/{id}
   */
  getMovie(id: number): Observable<Movie> {
    if (environment.mockData) {
      return this.mockGetMovie(id);
    }

    return this.http
      .get<Movie>(`${this.API_URL}/movies/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /movies/search
   * Soporta: q, genre, year_from, year_to, limit, offset
   */
  searchMovies(params: MovieSearchParams): Observable<MovieSearchResponse> {
    if (environment.mockData) {
      return this.mockSearchMovies(params);
    }

    let httpParams = new HttpParams();

    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.genre) httpParams = httpParams.set('genre', params.genre);
    if (params.year_from != null) httpParams = httpParams.set('year_from', params.year_from.toString());
    if (params.year_to   != null) httpParams = httpParams.set('year_to', params.year_to.toString());
    if (params.limit     != null) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.offset    != null) httpParams = httpParams.set('offset', params.offset.toString());

    return this.http
      .get<MovieSearchResponse>(`${this.API_URL}/movies/search`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }


  /**
   * GET /movies/top
   * metric=popular|rating, limit (y opcionalmente offset si lo añades luego)
   */
  getTopMovies(params?: TopMoviesParams): Observable<Movie[]> {
    if (environment.mockData) {
      return this.mockGetTopMovies(params);
    }

    let httpParams = new HttpParams();
    if (params?.metric) httpParams = httpParams.set('metric', params.metric);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http
      .get<Movie[]>(`${this.API_URL}/movies/top`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /movies/tmdb?tmdbId=603
   * Devuelve ExternalData (posterUrl, overview, cast, director, runtime, budget, revenue, tmdbFetched)
   */
  getMovieFromTmdb(tmdbId: string): Observable<ExternalData> {
    if (environment.mockData) {
      // en mock simplemente devolvemos datos fake
      const mock: ExternalData = {
        posterUrl: 'https://via.placeholder.com/500x750',
        overview: 'Sinopsis simulada (TMDB mock).',
        director: 'Director Mock',
        runtime: 120,
        budget: 100000000,
        revenue: 300000000,
        cast: [
          { name: 'Actor Mock 1' },
          { name: 'Actor Mock 2' }
        ],
        tmdbFetched: true
      };
      return of(mock).pipe(delay(400));
    }

    const params = new HttpParams().set('tmdbId', tmdbId);

    return this.http
      .get<ExternalData>(`${this.API_URL}/movies/tmdb`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /movies/tmdb-prefill?tmdbId=603
   * Devuelve un perfil completo para prellenar formularios
   */
  getMovieTmdbPrefill(tmdbId: string): Observable<MovieTmdbPrefill> {
    if (environment.mockData) {
      const mock: MovieTmdbPrefill = {
        title: 'Mock Matrix',
        year: 1999,
        genres: ['Action', 'Science Fiction'],
        overview: 'Mock overview para prellenar formulario.',
        runtime: 120,
        director: 'Mock Director',
        cast: [
          { name: 'Mock Actor 1' },
          { name: 'Mock Actor 2' }
        ],
        posterUrl: 'https://via.placeholder.com/500x750',
        links: {
          imdb: 'https://www.imdb.com/title/mock',
          tmdb: 'https://www.themoviedb.org/movie/mock'
        },
        userTags: ['mock', 'test'],
        genomeTags: [
          { tag: 'mock-tag', relevance: 1 }
        ]
      };
      return of(mock).pipe(delay(400));
    }

    const params = new HttpParams().set('tmdbId', tmdbId);

    return this.http
      .get<MovieTmdbPrefill>(`${this.API_URL}/movies/tmdb-prefill`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * POST /admin/movies
   * Crea una nueva película (solo ADMIN, requiere Authorization header en interceptor)
   */
  createMovie(payload: MovieCreateUpdateRequest): Observable<Movie> {
    if (environment.mockData) {
      // Simulamos creación
      const newId = Math.max(...this.mockMoviesData.map(m => m.movieId)) + 1;
      const now = new Date().toISOString();

      const movie: Movie = {
        movieId: newId,
        title: payload.title,
        year: payload.year,
        genres: payload.genres,
        links: payload.links,
        genomeTags: payload.genomeTags,
        userTags: payload.userTags,
        ratingStats: { average: 0, count: 0 },
        externalData: {
          posterUrl: payload.posterUrl,
          overview: payload.overview,
          cast: payload.cast,
          director: payload.director,
          runtime: payload.runtime,
          tmdbFetched: false
        },
        createdAt: now,
        updatedAt: now
      };

      this.mockMoviesData.push(MovieHelpers.toExtended(movie));
      return of(movie).pipe(delay(500));
    }

    return this.http
      .post<Movie>(`${this.API_URL}/admin/movies`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT /admin/movies/{id}
   * Actualiza una película existente
   */
  updateMovie(id: number, payload: MovieCreateUpdateRequest): Observable<Movie> {
    if (environment.mockData) {
      const idx = this.mockMoviesData.findIndex(m => m.movieId === id);
      if (idx === -1) {
        return throwError(() => ({ status: 404, error: 'Movie not found' }));
      }

      const now = new Date().toISOString();
      const updated: Movie = {
        movieId: id,
        title: payload.title,
        year: payload.year,
        genres: payload.genres,
        links: payload.links,
        genomeTags: payload.genomeTags,
        userTags: payload.userTags,
        ratingStats: this.mockMoviesData[idx].ratingStats,
        externalData: {
          posterUrl: payload.posterUrl,
          overview: payload.overview,
          cast: payload.cast,
          director: payload.director,
          runtime: payload.runtime,
          tmdbFetched: false
        },
        createdAt: this.mockMoviesData[idx].createdAt,
        updatedAt: now
      };

      this.mockMoviesData[idx] = MovieHelpers.toExtended(updated);
      return of(updated).pipe(delay(500));
    }

    return this.http
      .put<Movie>(`${this.API_URL}/admin/movies/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  // =====================================================
  // MOCK METHODS (para cuando mockData = true)
  // =====================================================

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

        // q -> título
        if (params.q) {
          const query = params.q.toLowerCase();
          results = results.filter(m => m.title.toLowerCase().includes(query));
        }

        // genre (puede venir "Action,Comedy")
        if (params.genre) {
          const genresFilter = params.genre.split(',').map(g => g.trim());
          results = results.filter(m =>
            m.genres.some(g => genresFilter.includes(g))
          );
        }

        // años
        if (params.year_from || params.year_to) {
          results = results.filter(m => {
            if (!m.year) return false;
            if (params.year_from && m.year < params.year_from) return false;
            if (params.year_to && m.year > params.year_to) return false;
            return true;
          });
        }

        // Ordenar por rating promedio desc
        results.sort(
          (a, b) =>
            (MovieHelpers.getAverageRating(b) || 0) -
            (MovieHelpers.getAverageRating(a) || 0)
        );

        const total = results.length;
        const offset = params.offset || 0;
        const limit = params.limit || 20;

        const pageMovies = results.slice(offset, offset + limit);

        return {
          movies: pageMovies,
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

        // si metric = rating, ordenamos por rating; si no, dejamos popularidad
        if (params?.metric === 'rating') {
          results.sort(
            (a, b) =>
              (MovieHelpers.getAverageRating(b) || 0) -
              (MovieHelpers.getAverageRating(a) || 0)
          );
        } else {
          results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        }

        const limit = params?.limit || 20;
        return results.slice(0, limit);
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('MovieService Error:', error);
    return throwError(() => error);
  }
}
