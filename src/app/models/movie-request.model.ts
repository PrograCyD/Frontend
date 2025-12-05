import type { Movie } from './movie.model';

export type MovieRequestStatus = 'pending' | 'approved' | 'rejected';
export type MovieRequestType = 'add' | 'edit';

/**
 * Estructura de los datos de película que viajan dentro de la solicitud.
 * Debe alinear con lo que armas en submitMovieRequest().
 */
export interface MovieRequestMovieData {
  title: string;
  year: number;
  genres: string[];

  // enlaces externos
  links?: {
    movielens?: string;
    imdb?: string;
    tmdb?: string;
  };

  // info descriptiva
  overview?: string;
  posterUrl?: string;
  director?: string;

  // números opcionales
  runtime?: number;
  budget?: number;
  revenue?: number;

  // texto libre que escribes en el form
  cast?: string;

  // lo que generas con form.cast.split(',') en el componente
  castDetails?: {
    name: string;
    imageUrl?: string;
  }[];

  // desde el formulario: form.genomeTags.split(',')
  genomeTags?: string[];

  // desde el formulario: form.userTags.split(',')
  userTags?: string[];

  // por si quieres enviar el JSON crudo
  jsonData?: string;
}

/**
 * Objeto que devuelve el backend para cada solicitud
 * (GET /me/movie-requests, GET /admin/movie-requests, etc.)
 */
export interface MovieRequest {
  requestId: string;           // id de la solicitud
  userId: number;
  requestType: MovieRequestType;
  status: MovieRequestStatus;
  movieData: MovieRequestMovieData;
  reviewNote?: string;         // nota del revisor (cuando aplica)
  reviewedBy?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Body que envías al backend para crear/editar una solicitud
 * Lo usas en UserManagementComponent.submitMovieRequest()
 */
export interface CreateMovieRequestParams {
  requestType: MovieRequestType;
  movieId?: number;                // solo cuando es 'edit'
  movieData: MovieRequestMovieData;
}

/**
 * Respuesta de aprobar una solicitud (si la usas en el admin)
 */
export interface ApproveMovieRequestResponse {
  movie: Movie;        // película ya creada/actualizada en la colección principal
  request: MovieRequest;
}
