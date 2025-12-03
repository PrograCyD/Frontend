import { Rating } from '../models/rating.model';

/**
 * Mock Ratings Data
 * Datos de prueba de calificaciones de usuarios
 * Adaptado desde FigmaMakeDemo a la estructura del backend (internal/models/rating.go)
 *
 * Backend structure:
 * - userId: number
 * - movieId: number
 * - rating: number (0.5 - 5.0)
 * - timestamp: number (Unix timestamp en segundos)
 */

export const mockRatings: Rating[] = [
  // Ratings for movie 1 - Horizonte Oscuro
  { userId: 1, movieId: 1, rating: 5.0, timestamp: 1700474200 }, // 2024-11-20T10:30:00
  { userId: 2, movieId: 1, rating: 4.0, timestamp: 1700573700 }, // 2024-11-21T14:15:00
  { userId: 3, movieId: 1, rating: 4.5, timestamp: 1700643900 }, // 2024-11-22T09:45:00
  { userId: 4, movieId: 1, rating: 4.0, timestamp: 1700751600 }, // 2024-11-23T16:20:00
  { userId: 5, movieId: 1, rating: 5.0, timestamp: 1700820000 }, // 2024-11-24T11:00:00

  // Ratings for movie 2 - Ecos del Pasado
  { userId: 1, movieId: 2, rating: 5.0, timestamp: 1700395200 }, // 2024-11-19T12:00:00
  { userId: 2, movieId: 2, rating: 4.5, timestamp: 1700493000 }, // 2024-11-20T15:30:00
  { userId: 3, movieId: 2, rating: 5.0, timestamp: 1700561700 }, // 2024-11-21T10:15:00
  { userId: 6, movieId: 2, rating: 4.0, timestamp: 1700664300 }, // 2024-11-22T14:45:00

  // Ratings for movie 3 - Risas sin Control
  { userId: 2, movieId: 3, rating: 4.0, timestamp: 1700313600 }, // 2024-11-18T13:20:00
  { userId: 4, movieId: 3, rating: 4.5, timestamp: 1700413200 }, // 2024-11-19T16:40:00
  { userId: 5, movieId: 3, rating: 3.5, timestamp: 1700480400 }, // 2024-11-20T11:30:00

  // Ratings for movie 4 - Dimensión Perdida
  { userId: 1, movieId: 4, rating: 4.5, timestamp: 1700209200 }, // 2024-11-17T09:00:00
  { userId: 3, movieId: 4, rating: 4.0, timestamp: 1700318400 }, // 2024-11-18T14:20:00
  { userId: 5, movieId: 4, rating: 4.0, timestamp: 1700394300 }, // 2024-11-19T10:45:00
  { userId: 6, movieId: 4, rating: 4.5, timestamp: 1700490600 }, // 2024-11-20T15:10:00

  // Ratings for movie 5 - Sombras de Medianoche
  { userId: 2, movieId: 5, rating: 4.0, timestamp: 1700137800 }, // 2024-11-16T12:30:00
  { userId: 4, movieId: 5, rating: 4.5, timestamp: 1700241600 }, // 2024-11-17T16:00:00
  { userId: 6, movieId: 5, rating: 4.0, timestamp: 1700303400 }, // 2024-11-18T11:20:00

  // Ratings for movie 6 - El Último Guardián
  { userId: 1, movieId: 6, rating: 4.0, timestamp: 1700058900 }, // 2024-11-15T14:15:00
  { userId: 3, movieId: 6, rating: 3.5, timestamp: 1700129400 }, // 2024-11-16T10:30:00
  { userId: 4, movieId: 6, rating: 4.5, timestamp: 1700235900 }, // 2024-11-17T15:45:00

  // Ratings for movie 7 - Código Rojo
  { userId: 1, movieId: 7, rating: 4.0, timestamp: 1699977000 }, // 2024-11-14T15:30:00
  { userId: 2, movieId: 7, rating: 4.5, timestamp: 1700051200 }, // 2024-11-15T12:00:00
  { userId: 5, movieId: 7, rating: 3.5, timestamp: 1700150400 }, // 2024-11-16T15:40:00

  // Ratings for movie 8 - Primavera en París
  { userId: 2, movieId: 8, rating: 5.0, timestamp: 1699896000 }, // 2024-11-13T17:00:00
  { userId: 3, movieId: 8, rating: 4.5, timestamp: 1699982400 }, // 2024-11-14T17:00:00
  { userId: 6, movieId: 8, rating: 4.0, timestamp: 1700068800 }, // 2024-11-15T17:00:00

  // Ratings for movie 9 - Profundidades Abisales
  { userId: 1, movieId: 9, rating: 4.5, timestamp: 1699809600 }, // 2024-11-12T17:00:00
  { userId: 4, movieId: 9, rating: 4.0, timestamp: 1699896000 }, // 2024-11-13T17:00:00
  { userId: 5, movieId: 9, rating: 4.0, timestamp: 1699982400 }, // 2024-11-14T17:00:00

  // Ratings for movie 10 - Caminos Cruzados
  { userId: 1, movieId: 10, rating: 5.0, timestamp: 1699723200 }, // 2024-11-11T17:00:00
  { userId: 2, movieId: 10, rating: 4.5, timestamp: 1699809600 }, // 2024-11-12T17:00:00
  { userId: 3, movieId: 10, rating: 5.0, timestamp: 1699896000 }, // 2024-11-13T17:00:00
  { userId: 6, movieId: 10, rating: 4.5, timestamp: 1699982400 }, // 2024-11-14T17:00:00

  // Ratings for movie 11 - Velocidad Máxima
  { userId: 3, movieId: 11, rating: 4.0, timestamp: 1699636800 }, // 2024-11-10T17:00:00
  { userId: 4, movieId: 11, rating: 4.5, timestamp: 1699723200 }, // 2024-11-11T17:00:00
  { userId: 5, movieId: 11, rating: 3.5, timestamp: 1699809600 }, // 2024-11-12T17:00:00

  // Ratings for movie 12 - La Casa del Lago
  { userId: 2, movieId: 12, rating: 4.5, timestamp: 1699550400 }, // 2024-11-09T17:00:00
  { userId: 4, movieId: 12, rating: 4.0, timestamp: 1699636800 }, // 2024-11-10T17:00:00
  { userId: 6, movieId: 12, rating: 4.5, timestamp: 1699723200 }, // 2024-11-11T17:00:00
];

/**
 * Helper functions para trabajar con ratings mock
 */

export const getRatingsByUser = (userId: number): Rating[] => {
  return mockRatings.filter(r => r.userId === userId);
};

export const getRatingsByMovie = (movieId: number): Rating[] => {
  return mockRatings.filter(r => r.movieId === movieId);
};

export const getUserRatingForMovie = (userId: number, movieId: number): Rating | undefined => {
  return mockRatings.find(r => r.userId === userId && r.movieId === movieId);
};

export const getAverageRatingForMovie = (movieId: number): number => {
  const ratings = getRatingsByMovie(movieId);
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return Number((sum / ratings.length).toFixed(2));
};

export const getRatingCountForMovie = (movieId: number): number => {
  return getRatingsByMovie(movieId).length;
};

/**
 * Datos mock de usuarios (simplificado, solo IDs y nombres)
 * Esto debería venir del auth service, pero lo incluimos aquí para referencia
 */
export const mockUserNames: Record<number, string> = {
  1: "Carlos Mendoza",
  2: "María García",
  3: "Juan Pérez",
  4: "Ana Martínez",
  5: "Luis Rodríguez",
  6: "Carmen López"
};

export const getUserName = (userId: number): string => {
  return mockUserNames[userId] || `Usuario ${userId}`;
};
