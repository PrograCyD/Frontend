/**
 * Modelo de Película
 * Replica la estructura del backend Go (internal/models/movie.go)
 */

export interface Movie {
  movieId: number;
  title: string;
  genres: string[];
  popularity?: number;
  tmdbId?: number;
  imdbId?: string;
  posterUrl?: string;
  backdropUrl?: string;
  overview?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  runtime?: number;
  originalLanguage?: string;
  tagline?: string;
}

export interface MovieSearchParams {
  query?: string;
  genres?: string[];
  minRating?: number;
  yearFrom?: number;
  yearTo?: number;
  limit?: number;
  offset?: number;
}

export interface MovieSearchResponse {
  movies: Movie[];
  total: number;
  limit: number;
  offset: number;
}

export interface TopMoviesParams {
  limit?: number;
  offset?: number;
  genre?: string;
}
