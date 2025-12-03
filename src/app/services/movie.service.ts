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
  MovieSearchParams,
  MovieSearchResponse,
  TopMoviesParams
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly API_URL = environment.apiUrl;

  // Mock database de películas
  private mockMovies: Movie[] = [];

  constructor(private http: HttpClient) {
    if (environment.mockData) {
      this.initializeMockMovies();
    }
  }

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
        const movie = this.mockMovies.find(m => m.movieId === id);
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
        let results = [...this.mockMovies];

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

        // Filtrar por rating mínimo
        if (params.minRating && params.minRating > 0) {
          results = results.filter(m =>
            (m.voteAverage || 0) >= params.minRating!
          );
        }

        // Filtrar por año
        if (params.yearFrom || params.yearTo) {
          results = results.filter(m => {
            if (!m.releaseDate) return false;
            const year = new Date(m.releaseDate).getFullYear();
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
        let results = [...this.mockMovies];

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

  /**
   * Inicializar películas mock
   */
  private initializeMockMovies(): void {
    const genres = [
      'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
      'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
      'TV Movie', 'Thriller', 'War', 'Western'
    ];

    const movieTitles = [
      'The Shawshank Redemption', 'The Godfather', 'The Dark Knight',
      'Pulp Fiction', 'Forrest Gump', 'Inception', 'The Matrix',
      'Goodfellas', 'The Silence of the Lambs', 'Interstellar',
      'The Green Mile', 'Parasite', 'Gladiator', 'The Prestige',
      'The Departed', 'Whiplash', 'The Lion King', 'Back to the Future',
      'The Pianist', 'Django Unchained', 'WALL·E', 'Avengers: Endgame',
      'Coco', 'Spirited Away', 'Joker', 'The Intouchables',
      'Your Name', 'Spider-Man: Into the Spider-Verse', 'Toy Story',
      'Casablanca', 'City of God', 'Life Is Beautiful', 'The Usual Suspects',
      'Léon: The Professional', 'Cinema Paradiso', 'Grave of the Fireflies',
      'Princess Mononoke', 'Once Upon a Time in America', 'American History X',
      'The Great Dictator', 'Paths of Glory', 'Witness for the Prosecution',
      'Rear Window', 'Aliens', 'Memento', 'The Shining', 'Apocalypse Now',
      'Dr. Strangelove', 'Oldboy', 'Amadeus', 'Das Boot'
    ];

    this.mockMovies = movieTitles.map((title, index) => {
      const movieId = index + 1;
      const randomGenres = this.getRandomGenres(genres, 2, 4);
      const releaseYear = 1970 + Math.floor(Math.random() * 55);

      return {
        movieId,
        title,
        genres: randomGenres,
        popularity: 50 + Math.random() * 450,
        tmdbId: 1000 + movieId,
        imdbId: `tt${(1000000 + movieId).toString()}`,
        posterUrl: `https://image.tmdb.org/t/p/w500/mock-poster-${movieId}.jpg`,
        backdropUrl: `https://image.tmdb.org/t/p/original/mock-backdrop-${movieId}.jpg`,
        overview: `This is a compelling story about ${title.toLowerCase()}. A masterpiece of cinema that has captivated audiences worldwide.`,
        releaseDate: `${releaseYear}-${this.padZero(Math.floor(Math.random() * 12) + 1)}-${this.padZero(Math.floor(Math.random() * 28) + 1)}`,
        voteAverage: 6.0 + Math.random() * 3.5,
        voteCount: Math.floor(1000 + Math.random() * 50000),
        runtime: 90 + Math.floor(Math.random() * 90),
        originalLanguage: Math.random() > 0.7 ? 'en' : ['es', 'fr', 'de', 'it', 'ja', 'ko'][Math.floor(Math.random() * 6)],
        tagline: `Experience the magic of ${title}`
      };
    });
  }

  private getRandomGenres(genres: string[], min: number, max: number): string[] {
    const count = min + Math.floor(Math.random() * (max - min + 1));
    const shuffled = [...genres].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  private handleError(error: any): Observable<never> {
    console.error('MovieService Error:', error);
    return throwError(() => error);
  }
}
