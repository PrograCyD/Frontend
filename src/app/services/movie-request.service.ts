import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import {
  MovieRequest,
  MovieRequestStatus,
  CreateMovieRequestParams,
  MovieRequestMovieData,
  ApproveMovieRequestResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MovieRequestService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Crear solicitud de película (usuario)
   * POST /me/movie-requests
   * Body: CreateMovieRequestParams
   * Response: MovieRequest
   */
  createMovieRequest(body: CreateMovieRequestParams): Observable<MovieRequest> {
    return this.http.post<MovieRequest>(
      `${this.API_URL}/me/movie-requests`,
      body
    );
  }

  /**
   * Obtener mis solicitudes de película (usuario)
   * GET /me/movie-requests?status=...&limit=...&offset=...
   * Response (según tu componente): { requests: MovieRequest[] }
   *
   * status: pending | approved | rejected | all   (por defecto: pending)
   */
  getMyMovieRequests(options?: {
    status?: MovieRequestStatus | 'all';
    limit?: number;
    offset?: number;
  }): Observable<{ requests: MovieRequest[] }> {
    let params = new HttpParams();

    if (options?.status) {
      params = params.set('status', options.status);
    }
    if (options?.limit != null) {
      params = params.set('limit', options.limit.toString());
    }
    if (options?.offset != null) {
      params = params.set('offset', options.offset.toString());
    }

    return this.http.get<{ requests: MovieRequest[] }>(
      `${this.API_URL}/me/movie-requests`,
      { params }
    );
  }

  /**
   * Obtener solicitudes como admin
   * GET /admin/movie-requests?status=...&limit=...&offset=...
   * Response: { requests: MovieRequest[] }
   */
  getAllMovieRequests(options?: {
    status?: MovieRequestStatus | 'all';
    limit?: number;
    offset?: number;
  }): Observable<{ requests: MovieRequest[] }> {
    let params = new HttpParams();

    if (options?.status) {
      params = params.set('status', options.status);
    }
    if (options?.limit != null) {
      params = params.set('limit', options.limit.toString());
    }
    if (options?.offset != null) {
      params = params.set('offset', options.offset.toString());
    }

    return this.http.get<{ requests: MovieRequest[] }>(
      `${this.API_URL}/admin/movie-requests`,
      { params }
    );
  }

  /**
   * Aprobar solicitud (admin)
   * POST /admin/movie-requests/{id}/approve
   *
   * Body: override opcional solo con campos de MovieRequestMovieData
   * Response: { movie, request }
   */
// movie-request.service.ts

  approveMovieRequest(
    requestId: string,
    reviewNote?: string,
    override?: Partial<MovieRequestMovieData>
  ): Observable<ApproveMovieRequestResponse> {
    const body: any = {};

    if (reviewNote) {
      body.reviewNote = reviewNote;   // nota opcional
    }
    if (override) {
      body.override = override;       // si algún día quieres sobreescribir campos
    }

    return this.http.post<ApproveMovieRequestResponse>(
      `${this.API_URL}/admin/movie-requests/${requestId}/approve`,
      body
    );
  }

  /**
   * Rechazar solicitud (admin)
   * POST /admin/movie-requests/{id}/reject
   *
   * Body: { reason }
   * Response: MovieRequest (ya con status "rejected")
   */
  rejectMovieRequest(
    requestId: string,
    reason: string
  ): Observable<MovieRequest> {
    return this.http.post<MovieRequest>(
      `${this.API_URL}/admin/movie-requests/${requestId}/reject`,
      { reason }
    );
  }
}
