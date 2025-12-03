/**
 * Modelo de Usuario
 * Replica la estructura del backend Go (internal/models/user.go)
 */

export interface User {
  userId: number;
  email: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  role: 'admin' | 'user';
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
}
