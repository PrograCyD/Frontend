/**
 * Modelo de Recomendación
 * Replica la estructura del backend Go (internal/models/recommendation.go)
 */

export interface RecItem {
  movieId: number;
  score: number;
}

export interface RecommendationDoc {
  id?: string;
  userId: number;
  algo: string;
  similarityMetric: string;
  params: any;
  items: RecItem[];
  createdAt: string; // ISO 8601 timestamp
}

export interface Recommendation {
  movieId: number;
  score: number;
  title?: string;
  reason?: string;
  posterUrl?: string;
  genres?: string[];
  voteAverage?: number;
}

export interface RecommendationResponse {
  userId: number;
  items: RecItem[] | Recommendation[];
  generatedAt?: string; // ISO 8601 timestamp
  fromCache?: boolean;
  algorithm?: string;
}

export interface RecommendationParams {
  k?: number; // Número de recomendaciones (default: 20, max: 50)
  refresh?: boolean; // Forzar recálculo sin usar caché
}

/**
 * Mensajes WebSocket para recomendaciones en tiempo real
 * Usado en el endpoint /users/{id}/ws/recommendations (solo admin)
 */
export interface WSMessage {
  type: 'start' | 'progress' | 'recommendations' | 'error';
  msg?: string;
  progress?: number; // Progress percentage (0-100)
  nodeId?: string; // ID del nodo ML
  shard?: number; // Número de shard ML (1-4)
  userId?: number;
  items?: RecItem[];
  generatedAt?: string;
  error?: string;
}

/**
 * Explicación de vecinos para el endpoint /recommendations/explain
 */
export interface NeighborContribution {
  neighbor_movie_id: number;
  sim: number;
  user_rating: number;
  contribution: number;
}

export interface Explanation {
  movie_id: number;
  score: number;
  neighbors: NeighborContribution[];
}

export interface RecommendationHistoryItem {
  userId: number;
  movieId: number;
  score: number;
  generatedAt: string;
  algorithm: string;
  fromCache: boolean;
}
