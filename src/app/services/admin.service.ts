/**
 * AdminService - Servicio de Administración
 *
 * Endpoints del backend:
 * - GET /admin/movies - Listar películas con filtros (admin)
 * - POST /admin/movies - Crear película (admin)
 * - PUT /admin/movies/{id} - Actualizar película (admin)
 * - DELETE /admin/movies/{id} - Eliminar película (admin)
 * - GET /admin/ratings - Listar todos los ratings (admin)
 * - POST /admin/ratings - Crear rating (admin)
 * - PUT /admin/ratings - Actualizar rating (admin)
 * - DELETE /admin/ratings - Eliminar rating (admin)
 * - POST /admin/remap-database - Remapear base de datos (admin)
 *
 * MOCK MODE: Actualmente usa datos simulados.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Movie,
  CreateMovieRequest,
  UpdateMovieRequest,
  DeleteMovieResponse,
  MoviesManagementParams,
  MoviesManagementResponse,
  AllRatingsParams,
  AllRatingsResponse,
  CreateRatingByAdminRequest,
  UpdateRatingByAdminRequest,
  DeleteRatingByAdminRequest,
  RemapDatabaseResponse,
  AdminStats,
  RatingWithDetails
} from '../models';
import { mockMovies } from '../data/mock-movies';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = environment.apiUrl;

  // Mock databases
  private mockMoviesDb: Movie[] = [];
  private mockRatingsDb: RatingWithDetails[] = [];

  constructor(private http: HttpClient) {
    if (environment.mockData) {
      this.initializeMockData();
    }
  }

  // ============================================
  // GESTIÓN DE PELÍCULAS
  // ============================================

  getMoviesForManagement(params?: MoviesManagementParams): Observable<MoviesManagementResponse> {
    if (environment.mockData) {
      return this.mockGetMoviesForManagement(params);
    }

    let httpParams = new HttpParams();
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset) httpParams = httpParams.set('offset', params.offset.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.genre) httpParams = httpParams.set('genre', params.genre);
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    return this.http.get<MoviesManagementResponse>(`${this.API_URL}/admin/movies`, { params: httpParams });
  }

  createMovie(movie: CreateMovieRequest): Observable<Movie> {
    if (environment.mockData) {
      return this.mockCreateMovie(movie);
    }

    return this.http.post<Movie>(`${this.API_URL}/admin/movies`, movie);
  }

  updateMovie(movie: UpdateMovieRequest): Observable<Movie> {
    if (environment.mockData) {
      return this.mockUpdateMovie(movie);
    }

    return this.http.put<Movie>(`${this.API_URL}/admin/movies/${movie.movieId}`, movie);
  }

  deleteMovie(movieId: number): Observable<DeleteMovieResponse> {
    if (environment.mockData) {
      return this.mockDeleteMovie(movieId);
    }

    return this.http.delete<DeleteMovieResponse>(`${this.API_URL}/admin/movies/${movieId}`);
  }

  fetchMovieFromUrl(url: string): Observable<Movie> {
    if (environment.mockData) {
      // En modo mock, simular la respuesta
      return of({
        movieId: Math.floor(Math.random() * 10000),
        title: 'Película Importada',
        year: 2024,
        genres: ['Drama', 'Action'],
        links: {
          tmdb: url,
          imdb: '',
          movielens: ''
        },
        externalData: {
          posterUrl: 'https://via.placeholder.com/500x750',
          overview: 'Esta es una película importada desde una URL externa.',
          director: 'Director Importado',
          runtime: 120,
          cast: [
            { name: 'Actor 1', profileUrl: '' },
            { name: 'Actor 2', profileUrl: '' }
          ]
        }
      } as Movie).pipe(delay(1000));
    }

    // Llamar al backend para obtener los datos desde la URL
    return this.http.post<Movie>(`${this.API_URL}/admin/movies/fetch-from-url`, { url });
  }

  // ============================================
  // GESTIÓN DE RATINGS
  // ============================================

  getAllRatings(params?: AllRatingsParams): Observable<AllRatingsResponse> {
    if (environment.mockData) {
      return this.mockGetAllRatings(params);
    }

    let httpParams = new HttpParams();
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset) httpParams = httpParams.set('offset', params.offset.toString());
    if (params?.userId) httpParams = httpParams.set('userId', params.userId.toString());
    if (params?.movieId) httpParams = httpParams.set('movieId', params.movieId.toString());
    if (params?.minRating) httpParams = httpParams.set('minRating', params.minRating.toString());
    if (params?.maxRating) httpParams = httpParams.set('maxRating', params.maxRating.toString());

    return this.http.get<AllRatingsResponse>(`${this.API_URL}/admin/ratings`, { params: httpParams });
  }

  createRatingByAdmin(request: CreateRatingByAdminRequest): Observable<RatingWithDetails> {
    if (environment.mockData) {
      return this.mockCreateRating(request);
    }

    return this.http.post<RatingWithDetails>(`${this.API_URL}/admin/ratings`, request);
  }

  updateRatingByAdmin(request: UpdateRatingByAdminRequest): Observable<RatingWithDetails> {
    if (environment.mockData) {
      return this.mockUpdateRating(request);
    }

    return this.http.put<RatingWithDetails>(`${this.API_URL}/admin/ratings`, request);
  }

  deleteRatingByAdmin(request: DeleteRatingByAdminRequest): Observable<void> {
    if (environment.mockData) {
      return this.mockDeleteRating(request);
    }

    let httpParams = new HttpParams()
      .set('userId', request.userId.toString())
      .set('movieId', request.movieId.toString());

    return this.http.delete<void>(`${this.API_URL}/admin/ratings`, { params: httpParams });
  }

  // ============================================
  // REMAPEO DE BASE DE DATOS
  // ============================================

  remapDatabase(): Observable<RemapDatabaseResponse> {
    if (environment.mockData) {
      return this.mockRemapDatabase();
    }

    return this.http.post<RemapDatabaseResponse>(`${this.API_URL}/admin/remap-database`, {});
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  getAdminStats(): Observable<AdminStats> {
    if (environment.mockData) {
      return this.mockGetAdminStats();
    }

    return this.http.get<AdminStats>(`${this.API_URL}/admin/stats`);
  }

  // ============================================
  // MOCK METHODS - PELÍCULAS
  // ============================================

  private mockGetMoviesForManagement(params?: MoviesManagementParams): Observable<MoviesManagementResponse> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let movies = [...this.mockMoviesDb];

        // Filtrar por búsqueda
        if (params?.search) {
          const search = params.search.toLowerCase();
          movies = movies.filter(m => m.title.toLowerCase().includes(search));
        }

        // Filtrar por género
        if (params?.genre) {
          movies = movies.filter(m => m.genres.includes(params.genre!));
        }

        // Ordenar
        if (params?.sortBy) {
          movies.sort((a, b) => {
            let aVal: any, bVal: any;
            switch (params.sortBy) {
              case 'title':
                aVal = a.title;
                bVal = b.title;
                break;
              case 'year':
                aVal = a.year || 0;
                bVal = b.year || 0;
                break;
              case 'rating':
                aVal = a.ratingStats?.average || 0;
                bVal = b.ratingStats?.average || 0;
                break;
              case 'popularity':
                aVal = 0; // Popularity no disponible en estructura backend
                bVal = 0;
                break;
              default:
                aVal = a.movieId;
                bVal = b.movieId;
            }

            if (params.sortOrder === 'desc') {
              return aVal < bVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
          });
        }

        const total = movies.length;
        const offset = params?.offset || 0;
        const limit = params?.limit || 10;
        movies = movies.slice(offset, offset + limit);

        return {
          movies,
          total,
          limit,
          offset
        };
      })
    );
  }

  private mockCreateMovie(movie: CreateMovieRequest): Observable<Movie> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const newMovie: Movie = {
          movieId: Math.max(...this.mockMoviesDb.map(m => m.movieId)) + 1,
          title: movie.title,
          year: movie.year,
          genres: movie.genres,
          links: {
            imdb: movie.imdbId,
            tmdb: movie.tmdbId?.toString(),
            movielens: movie.movieLensId?.toString()
          },
          genomeTags: [],
          userTags: [],
          ratingStats: {
            average: 0,
            count: 0
          },
          externalData: {
            posterUrl: movie.posterPath,
            overview: movie.overview,
            runtime: movie.runtime,
            budget: movie.budget,
            revenue: movie.revenue,
            tmdbFetched: false
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.mockMoviesDb.push(newMovie);
        return newMovie;
      })
    );
  }

  private mockUpdateMovie(movie: UpdateMovieRequest): Observable<Movie> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const index = this.mockMoviesDb.findIndex(m => m.movieId === movie.movieId);
        if (index === -1) {
          throw new Error('Movie not found');
        }

        const existing = this.mockMoviesDb[index];
        this.mockMoviesDb[index] = {
          ...existing,
          title: movie.title || existing.title,
          year: movie.year ?? existing.year,
          genres: movie.genres || existing.genres,
          updatedAt: new Date().toISOString()
        };

        return this.mockMoviesDb[index];
      }),
      catchError(err => throwError(() => err))
    );
  }

  private mockDeleteMovie(movieId: number): Observable<DeleteMovieResponse> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const index = this.mockMoviesDb.findIndex(m => m.movieId === movieId);
        if (index === -1) {
          throw new Error('Movie not found');
        }

        this.mockMoviesDb.splice(index, 1);

        // También eliminar ratings asociados
        this.mockRatingsDb = this.mockRatingsDb.filter(r => r.movieId !== movieId);

        return {
          success: true,
          message: 'Movie deleted successfully'
        };
      }),
      catchError(err => throwError(() => err))
    );
  }

  // ============================================
  // MOCK METHODS - RATINGS
  // ============================================

  private mockGetAllRatings(params?: AllRatingsParams): Observable<AllRatingsResponse> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let ratings = [...this.mockRatingsDb];

        // Filtros
        if (params?.userId) {
          ratings = ratings.filter(r => r.userId === params.userId);
        }
        if (params?.movieId) {
          ratings = ratings.filter(r => r.movieId === params.movieId);
        }
        if (params?.minRating) {
          ratings = ratings.filter(r => r.rating >= params.minRating!);
        }
        if (params?.maxRating) {
          ratings = ratings.filter(r => r.rating <= params.maxRating!);
        }

        const total = ratings.length;
        const offset = params?.offset || 0;
        const limit = params?.limit || 10;
        ratings = ratings.slice(offset, offset + limit);

        return {
          ratings,
          total,
          limit,
          offset
        };
      })
    );
  }

  private mockCreateRating(request: CreateRatingByAdminRequest): Observable<RatingWithDetails> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const movie = this.mockMoviesDb.find(m => m.movieId === request.movieId);
        const newRating: RatingWithDetails = {
          userId: request.userId,
          movieId: request.movieId,
          rating: request.rating,
          timestamp: Math.floor(Date.now() / 1000),
          movieTitle: movie?.title || `Movie ${request.movieId}`,
          userName: `User ${request.userId}`
        };
        this.mockRatingsDb.push(newRating);
        return newRating;
      })
    );
  }

  private mockUpdateRating(request: UpdateRatingByAdminRequest): Observable<RatingWithDetails> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const index = this.mockRatingsDb.findIndex(
          r => r.userId === request.userId && r.movieId === request.movieId
        );

        if (index === -1) {
          throw new Error('Rating not found');
        }

        this.mockRatingsDb[index].rating = request.rating;
        this.mockRatingsDb[index].timestamp = Math.floor(Date.now() / 1000);

        return this.mockRatingsDb[index];
      }),
      catchError(err => throwError(() => err))
    );
  }

  private mockDeleteRating(request: DeleteRatingByAdminRequest): Observable<void> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const index = this.mockRatingsDb.findIndex(
          r => r.userId === request.userId && r.movieId === request.movieId
        );

        if (index !== -1) {
          this.mockRatingsDb.splice(index, 1);
        }
      })
    );
  }

  // ============================================
  // MOCK METHODS - REMAPEO
  // ============================================

  private mockRemapDatabase(): Observable<RemapDatabaseResponse> {
    return of(null).pipe(
      delay(2000), // Simular proceso largo
      map(() => {
        return {
          success: true,
          message: 'Database remapped successfully',
          affectedMovies: this.mockMoviesDb.length,
          affectedRatings: this.mockRatingsDb.length,
          duration: 2000
        };
      })
    );
  }

  // ============================================
  // MOCK METHODS - STATS
  // ============================================

  private mockGetAdminStats(): Observable<AdminStats> {
    return of(null).pipe(
      delay(200),
      map(() => {
        return {
          totalMovies: this.mockMoviesDb.length,
          totalUsers: 10, // Mock value
          totalRatings: this.mockRatingsDb.length,
          pendingRequests: 0
        };
      })
    );
  }

  // ============================================
  // INICIALIZACIÓN
  // ============================================

  private initializeMockData(): void {
    // Copiar películas de mock-movies
    this.mockMoviesDb = [...mockMovies];

    // Crear algunos ratings de ejemplo
    this.mockRatingsDb = [
      {
        userId: 1,
        movieId: 1,
        rating: 5.0,
        timestamp: Math.floor(Date.now() / 1000) - 86400,
        movieTitle: mockMovies[0]?.title || 'Movie 1',
        userName: 'John Doe'
      },
      {
        userId: 1,
        movieId: 2,
        rating: 4.5,
        timestamp: Math.floor(Date.now() / 1000) - 172800,
        movieTitle: mockMovies[1]?.title || 'Movie 2',
        userName: 'John Doe'
      },
      {
        userId: 2,
        movieId: 1,
        rating: 4.0,
        timestamp: Math.floor(Date.now() / 1000) - 259200,
        movieTitle: mockMovies[0]?.title || 'Movie 1',
        userName: 'Jane Smith'
      }
    ];
  }
}
