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
  movieLensId?: number;
  posterUrl?: string;
  posterPath?: string; // Alias for UI compatibility
  backdropUrl?: string;
  backdropPath?: string; // Alias for UI compatibility
  overview?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  averageRating?: number; // For user ratings (0-5 scale)
  runtime?: number;
  originalLanguage?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
}

/**
 * Extended Movie interface with additional UI properties
 * Used for mock data and enhanced display
 */
export interface MovieExtended extends Movie {
  cast?: string[];
  director?: string;
  writers?: string[];
  tags?: string[];
  genomeTags?: string[];
  userTags?: string[];
  userRating?: number; // Current user's rating
  watchlistStatus?: boolean;
  favoriteStatus?: boolean;
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
