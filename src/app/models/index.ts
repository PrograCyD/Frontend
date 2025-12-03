/**
 * Barrel file para exportar todos los modelos
 * Facilita las importaciones en otros archivos
 *
 * Uso:
 * import { User, Movie, Rating } from '@app/models';
 */

// User models
export * from './user.model';

// Movie models
export * from './movie.model';

// Rating models
export * from './rating.model';

// Recommendation models
export * from './recommendation.model';

// Similarity models
export * from './similarity.model';

// API Response types
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Pagination
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
