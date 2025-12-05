// src/app/models/rating.model.ts (o donde lo tengas)

/**
 * Modelo de Rating (Calificación)
 * Replica la estructura del backend Go (rating.go)
 */
export interface Rating {
  userId: number;      // viene en las respuestas GET
  movieId: number;
  rating: number;      // 0.5 - 5.0 (incrementos de 0.5)
  timestamp: number;   // Unix timestamp
}

/**
 * Request para crear/actualizar rating.
 * El backend infiere el userId a partir del token (/me/ratings)
 * o del path param (/users/{id}/ratings).
 */
export interface CreateRatingRequest {
  movieId: number;
  rating: number;
}

// Ya no es necesario un UpdateRatingRequest separado,
// porque el POST crea o actualiza en el mismo endpoint.
// Si quieres lo puedes borrar o dejar por si acaso.
export interface UpdateRatingRequest {
  rating: number;
}

/**
 * Wrapper de conveniencia solo para el frontend.
 * El backend devuelve Rating[] y aquí lo envolvemos.
 */
export interface UserRatingsResponse {
  ratings: Rating[];
  total: number;
}
