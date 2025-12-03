/**
 * Modelos específicos para funcionalidades de Admin
 * Replica la estructura del backend Go (internal/models/admin_maintenance.go)
 */

import { Movie } from './movie.model';
import { Rating } from './rating.model';

// ============================================
// GESTIÓN DE PELÍCULAS (CRUD)
// ============================================

export interface CreateMovieRequest {
  title: string;
  year: number;
  genres: string[];
  tmdbId?: number;
  imdbId?: string;
  movieLensId?: number;
  genomeTags?: string[];
  userTags?: string[];
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  runtime?: number;
  budget?: number;
  revenue?: number;
  releaseDate?: string;
  originalLanguage?: string;
  tagline?: string;
}

export interface UpdateMovieRequest extends Partial<CreateMovieRequest> {
  movieId: number;
}

export interface DeleteMovieResponse {
  success: boolean;
  message: string;
}

export interface MoviesManagementParams {
  limit?: number;
  offset?: number;
  search?: string;
  genre?: string;
  sortBy?: 'title' | 'year' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface MoviesManagementResponse {
  movies: Movie[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================
// GESTIÓN DE RATINGS (CRUD)
// ============================================

export interface CreateRatingByAdminRequest {
  userId: number;
  movieId: number;
  rating: number;
}

export interface UpdateRatingByAdminRequest {
  userId: number;
  movieId: number;
  rating: number;
}

export interface DeleteRatingByAdminRequest {
  userId: number;
  movieId: number;
}

export interface AllRatingsParams {
  limit?: number;
  offset?: number;
  userId?: number;
  movieId?: number;
  minRating?: number;
  maxRating?: number;
}

export interface AllRatingsResponse {
  ratings: RatingWithDetails[];
  total: number;
  limit: number;
  offset: number;
}

export interface RatingWithDetails extends Rating {
  movieTitle?: string;
  userName?: string;
}

// ============================================
// REMAPEO DE BASE DE DATOS
// ============================================

export interface RemapDatabaseResponse {
  success: boolean;
  message: string;
  affectedMovies?: number;
  affectedRatings?: number;
  duration?: number;
}

// ============================================
// ESTADÍSTICAS DE ADMIN
// ============================================

export interface AdminStats {
  totalMovies: number;
  totalUsers: number;
  totalRatings: number;
  pendingRequests: number;
}

// ============================================
// SYSTEM HEALTH & MAINTENANCE (Original)
// ============================================

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  mongo: {
    connected: boolean;
    responseTime?: number;
  };
  redis: {
    connected: boolean;
    responseTime?: number;
  };
  mlNodes: Array<{
    nodeId: string;
    address: string;
    status: 'online' | 'offline';
    responseTime?: number;
  }>;
  timestamp: string;
}

export interface CacheStats {
  keys: number;
  memoryUsage: number;
  hits: number;
  misses: number;
  hitRate: number;
}

export interface DatabaseStats {
  collections: Array<{
    name: string;
    documentCount: number;
    size: number;
  }>;
  totalSize: number;
  totalDocuments: number;
}

export interface MLNodeInfo {
  nodeId: string;
  address: string;
  status: 'online' | 'offline';
  shard?: number;
  lastHealthCheck?: string;
  requestsProcessed?: number;
  averageResponseTime?: number;
}

export interface MaintenanceAction {
  action: 'clear-cache' | 'recompute-similarities' | 'rebuild-index' | 'cleanup-old-data';
  target?: string;
  params?: Record<string, any>;
}

export interface MaintenanceResult {
  success: boolean;
  action: string;
  message: string;
  duration?: number;
  affectedRecords?: number;
  timestamp: string;
}
