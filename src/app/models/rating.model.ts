/**
 * Modelo de Rating (Calificación)
 * Replica la estructura del backend Go (internal/models/rating.go)
 */

export interface Rating {
  userId: number;
  movieId: number;
  rating: number; // 0.5 - 5.0 (incrementos de 0.5)
  timestamp: number; // Unix timestamp
}

export interface CreateRatingRequest {
  movieId: number;
  rating: number;
}

export interface UpdateRatingRequest {
  rating: number;
}

export interface RatingWithMovie extends Rating {
  movieTitle?: string;
  moviePosterUrl?: string;
  movieGenres?: string[];
}

export interface UserRatingsResponse {
  ratings: Rating[];
  total: number;
}
