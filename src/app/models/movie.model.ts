/**
 * Modelo de Película
 * Replica la estructura del backend Go (internal/models/movie.go)
 */

export interface Links {
  movielens?: string;
  imdb?: string;
  tmdb?: string;
}

export interface GenomeTag {
  tag: string;
  relevance: number;
}

export interface CastMember {
  name: string;
  profileUrl?: string;
}

export interface ExternalData {
  posterUrl?: string;
  overview?: string;
  cast?: CastMember[];
  director?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  tmdbFetched: boolean;
}

export interface RatingStats {
  average: number;
  count: number;
  lastRatedAt?: string;
}

export interface Movie {
  movieId: number;
  iIdx?: number;
  title: string;
  year?: number;
  genres: string[];
  links?: Links;
  genomeTags?: GenomeTag[];
  userTags?: string[];
  ratingStats?: RatingStats;
  externalData?: ExternalData;
  createdAt: string;
  updatedAt: string;

  // @deprecated - Use externalData.posterUrl instead
  posterPath?: string;
  // @deprecated - Use externalData.posterUrl instead
  posterUrl?: string;
  // @deprecated - Use year instead
  releaseDate?: string;
  // @deprecated - Use ratingStats.average instead
  voteAverage?: number;
  averageRating?: number;
  // @deprecated - Use ratingStats.count instead
  voteCount?: number;
  // @deprecated - Use externalData properties
  overview?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  popularity?: number;
  originalLanguage?: string;
  tagline?: string;
  backdropPath?: string;
  tags?: string[];
  // @deprecated - Use links properties
  tmdbId?: number;
  imdbId?: string;
  movieLensId?: number;
}

/**
 * Extended Movie interface with additional UI properties
 * Used for enhanced display and computed values
 */
export interface MovieExtended extends Movie {
  // Computed/derived properties for UI
  userRating?: number; // Current user's rating
  watchlistStatus?: boolean;
  favoriteStatus?: boolean;

  // Helpers for easier access (aliasing nested properties)
  posterPath?: string;
  backdropPath?: string;
  overview?: string;
  cast?: string[]; // Simplified cast for quick display
  director?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  averageRating?: number;
  voteAverage?: number; // Alias for averageRating
  voteCount?: number;
  popularity?: number;
  releaseDate?: string; // Formatted date string
  tmdbId?: number;
  imdbId?: string;
  movieLensId?: number;
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

/**
 * Helper functions to access nested properties
 */
export class MovieHelpers {
  static getPosterUrl(movie: Movie): string | undefined {
    return movie.externalData?.posterUrl;
  }

  static getOverview(movie: Movie): string | undefined {
    return movie.externalData?.overview;
  }

  static getDirector(movie: Movie): string | undefined {
    return movie.externalData?.director;
  }

  static getRuntime(movie: Movie): number | undefined {
    return movie.externalData?.runtime;
  }

  static getBudget(movie: Movie): number | undefined {
    return movie.externalData?.budget;
  }

  static getRevenue(movie: Movie): number | undefined {
    return movie.externalData?.revenue;
  }

  static getCast(movie: Movie): CastMember[] | undefined {
    return movie.externalData?.cast;
  }

  static getAverageRating(movie: Movie): number | undefined {
    return movie.ratingStats?.average;
  }

  static getRatingCount(movie: Movie): number | undefined {
    return movie.ratingStats?.count;
  }

  static getTmdbId(movie: Movie): string | undefined {
    return movie.links?.tmdb;
  }

  static getImdbId(movie: Movie): string | undefined {
    return movie.links?.imdb;
  }

  static getMovieLensId(movie: Movie): string | undefined {
    return movie.links?.movielens;
  }

  /**
   * Converts a Movie to MovieExtended with flattened properties for easier access
   */
  static toExtended(movie: Movie): MovieExtended {
    return {
      ...movie,
      posterPath: movie.externalData?.posterUrl,
      backdropPath: undefined,
      overview: movie.externalData?.overview,
      cast: movie.externalData?.cast?.map(c => c.name),
      director: movie.externalData?.director,
      runtime: movie.externalData?.runtime,
      budget: movie.externalData?.budget,
      revenue: movie.externalData?.revenue,
      averageRating: movie.ratingStats?.average,
      voteCount: movie.ratingStats?.count,
      voteAverage: movie.ratingStats?.average,
      popularity: undefined,
      releaseDate: movie.year ? `${movie.year}-01-01` : undefined,
      tmdbId: movie.links?.tmdb ? parseInt(movie.links.tmdb) : undefined,
      imdbId: movie.links?.imdb,
      movieLensId: movie.links?.movielens ? parseInt(movie.links.movielens) : undefined
    };
  }
}

