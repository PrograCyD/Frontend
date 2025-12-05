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

  // ---- Props viejas/alias solo para UI (opcionales) ----
  posterPath?: string;
  posterUrl?: string;
  releaseDate?: string;
  voteAverage?: number;
  averageRating?: number;
  voteCount?: number;
  overview?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  popularity?: number;
  originalLanguage?: string;
  tagline?: string;
  backdropPath?: string;
  tags?: string[];
  tmdbId?: number;
  imdbId?: string;
  movieLensId?: number;
}

/**
 * Extended Movie interface with additional UI properties
 * Used for enhanced display and computed values
 */
export interface MovieExtended extends Movie {
  // estado de usuario
  userRating?: number;
  watchlistStatus?: boolean;
  favoriteStatus?: boolean;

  // propiedades “aplanadas” para la UI
  cast?: string[];        // nombres de actores
  director?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  averageRating?: number;
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  releaseDate?: string;
}


/**
 * Parámetros de búsqueda /movies/search
 * Backend: q, genre, year_from, year_to, limit, offset
 */
export interface MovieSearchParams {
  q?: string;
  genre?: string;  // si quieres varios, envías "Action,Comedy" y el backend los separa
  year_from?: number;
  year_to?: number;
  limit?: number;
  offset?: number;
}

/**
 * Respuesta paginada de /movies/search
 * Esperado: objeto con total + límite + offset + lista
 */
export interface MovieSearchResponse {
  movies: Movie[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Parámetros para /movies/top
 * Backend: metric=popular|rating, limit
 */
export type MovieTopMetric = 'popular' | 'rating';

export interface TopMoviesParams {
  metric?: MovieTopMetric;
  limit?: number;
}

/**
 * Respuesta de /movies/tmdb-prefill
 * (perfil completo para prellenar formulario)
 */
export interface MovieTmdbPrefill {
  title: string;
  year: number;
  genres: string[];
  overview: string;
  runtime: number;
  director: string;
  cast: CastMember[];
  posterUrl: string;
  links: {
    imdb?: string;
    tmdb?: string;
  };
  userTags: string[];
  genomeTags: GenomeTag[];
}

/**
 * Cuerpo para crear/actualizar película (POST/PUT /admin/movies)
 */
export interface MovieCreateUpdateRequest {
  title: string;
  year: number;
  genres: string[];
  overview: string;
  runtime: number;
  director: string;
  cast: CastMember[];
  posterUrl: string;
  links: {
    imdb?: string;
    tmdb?: string;
  };
  userTags: string[];
  genomeTags: GenomeTag[];
}

/**
 * Helper functions to access nested properties
 */
export class MovieHelpers {
  static getPosterUrl(movie: Movie): string | undefined {
    return movie.externalData?.posterUrl ?? movie.posterUrl ?? movie.posterPath;
  }

  static getOverview(movie: Movie): string | undefined {
    return movie.externalData?.overview ?? movie.overview;
  }

  static getDirector(movie: Movie): string | undefined {
    return movie.externalData?.director;
  }

  static getRuntime(movie: Movie): number | undefined {
    return movie.externalData?.runtime ?? movie.runtime;
  }

  static getBudget(movie: Movie): number | undefined {
    return movie.externalData?.budget ?? movie.budget;
  }

  static getRevenue(movie: Movie): number | undefined {
    return movie.externalData?.revenue ?? movie.revenue;
  }

  static getCast(movie: Movie): CastMember[] | undefined {
    return movie.externalData?.cast;
  }

  static getAverageRating(movie: Movie): number | undefined {
    return movie.ratingStats?.average ?? movie.averageRating ?? movie.voteAverage;
  }

  static getRatingCount(movie: Movie): number | undefined {
    return movie.ratingStats?.count ?? movie.voteCount;
  }

  static getTmdbUrl(movie: Movie): string | undefined {
    return movie.links?.tmdb;
  }

  static getImdbUrl(movie: Movie): string | undefined {
    return movie.links?.imdb;
  }

  static getMovieLensUrl(movie: Movie): string | undefined {
    return movie.links?.movielens;
  }

  /**
   * Converts a Movie to MovieExtended with flattened properties for easier access
   */
  static toExtended(movie: Movie): MovieExtended {
    const releaseDate = movie.year ? `${movie.year}-01-01` : undefined;

    return {
      ...movie,
      posterPath: this.getPosterUrl(movie),
      overview: this.getOverview(movie),
      cast: movie.externalData?.cast?.map(c => c.name),
      director: movie.externalData?.director,
      runtime: this.getRuntime(movie),
      budget: this.getBudget(movie),
      revenue: this.getRevenue(movie),
      averageRating: this.getAverageRating(movie),
      voteAverage: this.getAverageRating(movie),
      voteCount: this.getRatingCount(movie),
      releaseDate
    };
  }
}
