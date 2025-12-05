/**
 * Modelo de Usuario
 * Replica la estructura del backend Go (internal/models/user.go)
 */

export interface User {
  userId: number;
  uIdx?: number;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  about?: string;
  preferredGenres?: string[];
  role: 'admin' | 'user';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  about?: string;
  preferredGenres?: string[];
  role?: 'admin' | 'user';
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  username?: string;
  firstName?: string;
  lastName?: string;
  about?: string;
  preferredGenres?: string[];
}

export interface UpdateUserResponse {
  updated: boolean;
}
