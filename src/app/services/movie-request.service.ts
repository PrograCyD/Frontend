/**
 * MovieRequestService - Servicio de Solicitudes de Películas
 *
 * Endpoints del backend:
 * - POST /me/movie-requests - Crear solicitud de película (usuario)
 * - GET /me/movie-requests - Obtener mis solicitudes (usuario)
 * - GET /admin/movie-requests - Obtener todas las solicitudes (admin)
 * - PUT /admin/movie-requests/{id}/approve - Aprobar solicitud (admin)
 * - PUT /admin/movie-requests/{id}/reject - Rechazar solicitud (admin)
 *
 * MOCK MODE: Actualmente usa datos simulados.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  MovieRequest,
  MovieRequestsResponse,
  CreateMovieRequestParams
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MovieRequestService {
  private readonly API_URL = environment.apiUrl;
  private mockRequests: MovieRequest[] = [];
  private nextRequestId = 1;

  constructor(private http: HttpClient) {
    if (environment.mockData) {
      this.initializeMockData();
    }
  }

  /**
   * Crear solicitud de película (usuario)
   */
  createMovieRequest(params: CreateMovieRequestParams): Observable<MovieRequest> {
    if (environment.mockData) {
      return this.mockCreateRequest(params);
    }

    return this.http.post<MovieRequest>(`${this.API_URL}/me/movie-requests`, params);
  }

  /**
   * Obtener mis solicitudes (usuario)
   */
  getMyMovieRequests(): Observable<MovieRequestsResponse> {
    if (environment.mockData) {
      return this.mockGetMyRequests();
    }

    return this.http.get<MovieRequestsResponse>(`${this.API_URL}/me/movie-requests`);
  }

  /**
   * Obtener todas las solicitudes (admin)
   */
  getAllMovieRequests(status?: 'pending' | 'approved' | 'rejected'): Observable<MovieRequestsResponse> {
    if (environment.mockData) {
      return this.mockGetAllRequests(status);
    }

    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<MovieRequestsResponse>(`${this.API_URL}/admin/movie-requests`, { params });
  }

  /**
   * Aprobar solicitud (admin)
   */
  approveMovieRequest(requestId: number, note?: string): Observable<MovieRequest> {
    if (environment.mockData) {
      return this.mockApproveRequest(requestId, note);
    }

    return this.http.put<MovieRequest>(
      `${this.API_URL}/admin/movie-requests/${requestId}/approve`,
      { note }
    );
  }

  /**
   * Rechazar solicitud (admin)
   */
  rejectMovieRequest(requestId: number, note?: string): Observable<MovieRequest> {
    if (environment.mockData) {
      return this.mockRejectRequest(requestId, note);
    }

    return this.http.put<MovieRequest>(
      `${this.API_URL}/admin/movie-requests/${requestId}/reject`,
      { note }
    );
  }

  // ============================================
  // MOCK METHODS
  // ============================================

  private mockCreateRequest(params: CreateMovieRequestParams): Observable<MovieRequest> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const currentUserId = parseInt(localStorage.getItem('userId') || '1');
        const request: MovieRequest = {
          requestId: this.nextRequestId++,
          userId: currentUserId,
          requestType: params.requestType,
          status: 'pending',
          movieId: params.movieId,
          movieData: params.movieData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.mockRequests.push(request);
        return request;
      })
    );
  }

  private mockGetMyRequests(): Observable<MovieRequestsResponse> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const currentUserId = parseInt(localStorage.getItem('userId') || '1');
        const userRequests = this.mockRequests.filter(r => r.userId === currentUserId);
        return {
          requests: userRequests,
          total: userRequests.length
        };
      })
    );
  }

  private mockGetAllRequests(status?: string): Observable<MovieRequestsResponse> {
    return of(null).pipe(
      delay(200),
      map(() => {
        let requests = [...this.mockRequests];
        if (status) {
          requests = requests.filter(r => r.status === status);
        }
        return {
          requests,
          total: requests.length
        };
      })
    );
  }

  private mockApproveRequest(requestId: number, note?: string): Observable<MovieRequest> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const request = this.mockRequests.find(r => r.requestId === requestId);
        if (!request) {
          throw new Error('Request not found');
        }
        const adminId = parseInt(localStorage.getItem('userId') || '1');
        request.status = 'approved';
        request.reviewedBy = adminId;
        request.reviewNote = note;
        request.updatedAt = new Date().toISOString();
        return request;
      })
    );
  }

  private mockRejectRequest(requestId: number, note?: string): Observable<MovieRequest> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const request = this.mockRequests.find(r => r.requestId === requestId);
        if (!request) {
          throw new Error('Request not found');
        }
        const adminId = parseInt(localStorage.getItem('userId') || '1');
        request.status = 'rejected';
        request.reviewedBy = adminId;
        request.reviewNote = note;
        request.updatedAt = new Date().toISOString();
        return request;
      })
    );
  }

  private initializeMockData(): void {
    // Algunas solicitudes de ejemplo
    this.mockRequests = [
      {
        requestId: this.nextRequestId++,
        userId: 1,
        requestType: 'add',
        status: 'pending',
        movieData: {
          title: 'New Movie 2024',
          year: 2024,
          genres: ['Action', 'Sci-Fi'],
          links: {
            imdb: 'tt1234567',
            tmdb: '987654'
          },
          genomeTags: ['space', 'future'],
          userTags: ['epic']
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
}
