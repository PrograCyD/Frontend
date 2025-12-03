/**
 * AuthService - Servicio de Autenticación
 *
 * Endpoints del backend:
 * - POST /auth/register - Registro de usuarios
 * - POST /auth/login - Login y generación de JWT
 * - PUT /users/{id}/update - Actualización de usuario (solo admin)
 *
 * MOCK MODE: Actualmente usa datos simulados.
 * Para activar API real: environment.mockData = false
 */

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateUserRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  // Signals para estado reactivo (Angular 20)
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  // Mock database - USUARIOS DE PRUEBA
  // ⭐ Para Login: usa email + password de abajo
  private mockUsers: User[] = [
    {
      userId: 1,
      email: 'admin@movies.com',
      role: 'admin',
      createdAt: new Date('2024-01-01')
    },
    {
      userId: 2,
      email: 'user@movies.com',
      role: 'user',
      createdAt: new Date('2024-01-15')
    },
    {
      userId: 3,
      email: 'john.doe@movies.com',
      role: 'user',
      createdAt: new Date('2024-02-10')
    },
    {
      userId: 4,
      email: 'jane.smith@movies.com',
      role: 'user',
      createdAt: new Date('2024-03-05')
    }
  ];

  private mockPasswords = new Map([
    ['admin@movies.com', 'admin123'],      // 🔑 ADMIN
    ['user@movies.com', 'user123'],        // 🔑 USER regular
    ['john.doe@movies.com', 'password123'],// 🔑 USER John
    ['jane.smith@movies.com', 'password123'] // 🔑 USER Jane
  ]);

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * Login - Autenticación de usuario
   * Backend: POST /auth/login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (environment.mockData) {
      return this.mockLogin(credentials);
    }

    // REAL API (activar cuando backend esté disponible)
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => this.saveToken(response)),
        catchError(this.handleError)
      );
  }

  /**
   * Register - Registro de nuevo usuario
   * Backend: POST /auth/register
   */
  register(data: RegisterRequest): Observable<LoginResponse> {
    if (environment.mockData) {
      return this.mockRegister(data);
    }

    // REAL API
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/register`, data)
      .pipe(
        tap(response => this.saveToken(response)),
        catchError(this.handleError)
      );
  }

  /**
   * Update User - Actualizar datos de usuario (solo admin)
   * Backend: PUT /users/{id}/update
   */
  updateUser(userId: number, data: UpdateUserRequest): Observable<User> {
    if (environment.mockData) {
      return this.mockUpdateUser(userId, data);
    }

    // REAL API
    return this.http.put<User>(`${this.API_URL}/users/${userId}/update`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Logout - Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.currentUser.set(null);
  }

  /**
   * Guardar token y datos de usuario en localStorage
   */
  saveToken(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('userRole', response.role);

    this.currentUser.set({
      userId: response.userId,
      email: '', // Se obtiene del token en producción
      role: response.role
    });
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
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    if (token && userId && userRole) {
      this.currentUser.set({
        userId: parseInt(userId),
        email: userEmail || '',
        role: userRole as 'admin' | 'user'
      });
    }
  }

  // ============================================
  // MOCK METHODS (Simular backend)
  // ============================================

  private mockLogin(credentials: LoginRequest): Observable<LoginResponse> {
    return of(null).pipe(
      delay(500), // Simular latencia de red
      map(() => {
        const user = this.mockUsers.find(u => u.email === credentials.email);
        const password = this.mockPasswords.get(credentials.email);

        if (!user || password !== credentials.password) {
          throw { error: 'Invalid credentials', status: 401 };
        }

        const response: LoginResponse = {
          token: this.generateMockJWT(user),
          userId: user.userId,
          role: user.role
        };

        localStorage.setItem('userEmail', user.email);
        this.saveToken(response);

        return response;
      }),
      catchError(err => throwError(() => err))
    );
  }

  private mockRegister(data: RegisterRequest): Observable<LoginResponse> {
    return of(null).pipe(
      delay(500),
      map(() => {
        // Verificar si el email ya existe
        if (this.mockUsers.find(u => u.email === data.email)) {
          throw { error: 'Email already exists', status: 400 };
        }

        const newUser: User = {
          userId: this.mockUsers.length + 1,
          email: data.email,
          role: data.role || 'user',
          createdAt: new Date()
        };

        this.mockUsers.push(newUser);
        this.mockPasswords.set(data.email, data.password);

        const response: LoginResponse = {
          token: this.generateMockJWT(newUser),
          userId: newUser.userId,
          role: newUser.role
        };

        localStorage.setItem('userEmail', newUser.email);
        this.saveToken(response);

        return response;
      }),
      catchError(err => throwError(() => err))
    );
  }

  private mockUpdateUser(userId: number, data: UpdateUserRequest): Observable<User> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const userIndex = this.mockUsers.findIndex(u => u.userId === userId);

        if (userIndex === -1) {
          throw { error: 'User not found', status: 404 };
        }

        const user = this.mockUsers[userIndex];
        const oldEmail = user.email;

        if (data.email) user.email = data.email;
        if (data.role) user.role = data.role;
        if (data.password && data.email) {
          this.mockPasswords.delete(oldEmail);
          this.mockPasswords.set(data.email, data.password);
        }

        user.updatedAt = new Date();

        return user;
      }),
      catchError(err => throwError(() => err))
    );
  }

  private generateMockJWT(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.userId,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    }));
    const signature = btoa(`mock-signature-${user.userId}-${Date.now()}`);

    return `${header}.${payload}.${signature}`;
  }

  private handleError(error: any): Observable<never> {
    console.error('AuthService Error:', error);
    return throwError(() => error);
  }
}
