/**
 * Modelo de Similitud entre películas
 * Replica la estructura del backend Go (internal/models/similarity.go)
 *
 * Este modelo representa las similitudes item-based precomputadas
 * que los nodos ML utilizan para generar recomendaciones
 */

export interface Similarity {
  movieId: number;
  similarMovieId: number;
  score: number; // Cosine similarity score (0-1)
}

export interface MovieSimilarities {
  movieId: number;
  similarities: Array<{
    movieId: number;
    score: number;
  }>;
}

export interface SimilarMoviesParams {
  movieId: number;
  limit?: number;
}

export interface SimilarMoviesResponse {
  movieId: number;
  similarMovies: Array<{
    movieId: number;
    title: string;
    score: number;
    posterUrl?: string;
    genres?: string[];
  }>;
}
