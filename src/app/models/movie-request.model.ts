/**
 * Movie Request Models
 * Para solicitudes de agregar/editar películas
 */

export interface MovieRequest {
  requestId?: number;
  userId: number;
  requestType: 'add' | 'edit';
  status: 'pending' | 'approved' | 'rejected';
  movieId?: number; // Solo para editar
  movieData: MovieRequestData;
  createdAt?: string;
  updatedAt?: string;
  reviewedBy?: number;
  reviewNote?: string;
}

export interface MovieRequestData {
  title: string;
  year: number;
  genres: string[];
  links: {
    movieLens?: string;
    imdb?: string;
    tmdb?: string;
  };
  genomeTags?: string[];
  userTags?: string[];
  posterUrl?: string;
  overview?: string;
  cast?: string; // Comma-separated actor names
  castDetails?: Array<{ name: string; imageUrl?: string }>; // Cast with images
  director?: string;
  runtime?: number; // Duration in minutes
  budget?: number;
  revenue?: number;
  jsonData?: string; // JSON completo de la película
}

export interface CreateMovieRequestParams {
  requestType: 'add' | 'edit';
  movieId?: number;
  movieData: MovieRequestData;
}

export interface MovieRequestsResponse {
  requests: MovieRequest[];
  total: number;
}
