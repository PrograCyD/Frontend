/**
 * AuthService - Servicio de Autenticación
 *
 * Endpoints del backend:
 * - POST /auth/login      - Login y generación de JWT
 * - POST /auth/register   - Registro de usuarios
 * - PUT  /users/{id}/update - Actualización de usuario (solo admin)
 */

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateUserRequest,
  UpdateUserResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  // Signals para estado reactivo
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * Login - Autenticación de usuario
   * Backend: POST /auth/login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(res => this.saveSession(res)),
        catchError(this.handleError)
      );
  }

  /**
   * Register - Registro de nuevo usuario
   * Backend: POST /auth/register
   * El backend devuelve el User creado (sin token).
   */
  register(data: RegisterRequest): Observable<User> {
    return this.http
      .post<User>(`${this.API_URL}/auth/register`, data)
      .pipe(
        // aquí NO se guarda sesión porque el backend no devuelve token
        catchError(this.handleError)
      );
  }

  /**
   * Update User - Actualizar datos de usuario (solo admin)
   * Backend: PUT /users/{id}/update
   */
  updateUser(userId: number, data: UpdateUserRequest): Observable<UpdateUserResponse> {
    return this.http
      .put<UpdateUserResponse>(`${this.API_URL}/users/${userId}/update`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Logout - Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  /**
   * Guardar token y datos de usuario en localStorage
   */
  private saveSession(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  /**
   * Obtener token JWT del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticatedUser(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdminUser(): boolean {
    return this.isAdmin();
  }

  /**
   * Cargar usuario desde localStorage al iniciar
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        this.currentUser.set(user);
      } catch {
        this.logout();
      }
    }
  }

  private handleError(error: any) {
    console.error('AuthService Error:', error);
    return throwError(() => error);
  }
}
