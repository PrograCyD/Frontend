/**
 * Modelo de Recomendación
 * Replica la estructura del backend Go (internal/models/recommendation.go)
 */

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
  items: Recommendation[];
  generatedAt: string; // ISO 8601 timestamp
  fromCache: boolean;
  algorithm?: string;
}

export interface RecommendationParams {
  k?: number; // Número de recomendaciones (default: 20)
  refresh?: boolean; // Forzar recálculo sin usar caché
}

/**
 * Mensajes WebSocket para recomendaciones en tiempo real
 * Usado en el endpoint /users/{id}/ws/recommendations (solo admin)
 */
export interface WSMessage {
  type: 'start' | 'progress' | 'recommendations' | 'error';
  msg?: string;
  progress?: number; // 0-100
  nodeId?: string; // ID del nodo ML (1-4)
  userId?: number;
  items?: Recommendation[];
  generatedAt?: string;
  error?: string;
}

export interface RecommendationHistoryItem {
  userId: number;
  movieId: number;
  score: number;
  generatedAt: string;
  algorithm: string;
  fromCache: boolean;
}
