/**
 * Componente de Testing para Servicios
 *
 * Este componente te permite probar todos los servicios con datos mock
 * sin necesidad de crear la UI completa.
 *
 * Para usar:
 * 1. Importar este componente en una ruta temporal
 * 2. Navegar a esa ruta
 * 3. Abrir consola del navegador
 * 4. Hacer clic en los botones para probar cada servicio
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  MovieService,
  RatingService,
  RecommendationService
} from '../services';

@Component({
  selector: 'app-service-tester',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: system-ui;">
      <h1><span class="material-icons">science</span> Service Tester (Mock Mode)</h1>
      <p>Abre la consola del navegador (F12) para ver los resultados</p>

      <div style="margin-top: 20px;">
        <h2><span class="material-icons">lock</span> AuthService</h2>
        <p>User autenticado: {{ currentUser() ? currentUser()!.email : 'Ninguno' }}</p>
        <p>Es Admin: {{ isAdmin() ? 'Sí' : 'No' }}</p>

        <button (click)="testLogin()">Login como User</button>
        <button (click)="testLoginAdmin()">Login como Admin</button>
        <button (click)="testRegister()">Registrar Nuevo Usuario</button>
        <button (click)="testLogout()">Logout</button>
      </div>

      <div style="margin-top: 20px;">
        <h2><span class="material-icons">movie</span> MovieService</h2>
        <button (click)="testGetMovie()">Obtener Película #1</button>
        <button (click)="testSearchMovies()">Buscar "The"</button>
        <button (click)="testTopMovies()">Top 10 Películas</button>
      </div>

      <div style="margin-top: 20px;">
        <h2><span class="material-icons">star</span> RatingService</h2>
        <button (click)="testCreateRating()">Calificar Película #1 (4.5★)</button>
        <button (click)="testGetMyRatings()">Ver Mis Ratings</button>
      </div>

      <div style="margin-top: 20px;">
        <h2><span class="material-icons">recommend</span> RecommendationService</h2>
        <button (click)="testGetRecommendations()">Obtener Recomendaciones</button>
        <button (click)="testGetRecommendationsRefresh()">Recomendaciones (Refresh)</button>
        <button (click)="testWebSocket()">Test WebSocket (Admin)</button>
      </div>

      <div style="margin-top: 20px; padding: 10px; background: #f0f0f0;">
        <h3><span class="material-icons">bar_chart</span> Resultados</h3>
        <pre style="max-height: 400px; overflow-y: auto;">{{ results() }}</pre>
      </div>
    </div>
  `,
  styles: [`
    button {
      margin: 5px;
      padding: 10px 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      background: #0056b3;
    }
    h2 {
      margin-top: 20px;
      color: #333;
    }
  `]
})
export class ServiceTesterComponent {
  private authService = inject(AuthService);
  private movieService = inject(MovieService);
  private ratingService = inject(RatingService);
  private recService = inject(RecommendationService);

  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;
  results = signal<string>('Haz clic en un botón para probar un servicio...');

  // ========================================
  // AUTH TESTS
  // ========================================

  testLogin() {
    console.log('🔐 Testing login...');
    this.authService.login({
      email: 'user@movies.com',
      password: 'user123'
    }).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        this.results.set(JSON.stringify(response, null, 2));
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  testLoginAdmin() {
    console.log('🔐 Testing admin login...');
    this.authService.login({
      email: 'admin@movies.com',
      password: 'admin123'
    }).subscribe({
      next: (response) => {
        console.log('✅ Admin login exitoso:', response);
        this.results.set(JSON.stringify(response, null, 2));
      },
      error: (err) => {
        console.error('❌ Error en admin login:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  testRegister() {
    const randomEmail = `newuser${Date.now()}@test.com`;
    console.log('📝 Testing register...');
    this.authService.register({
      email: randomEmail,
      password: 'test123',
      role: 'user'
    }).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso:', response);
        this.results.set(JSON.stringify(response, null, 2));
      },
      error: (err) => {
        console.error('❌ Error en registro:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  testLogout() {
    console.log('👋 Testing logout...');
    this.authService.logout();
    console.log('✅ Logout completado');
    this.results.set('Logout exitoso. Usuario: ' + (this.currentUser() || 'ninguno'));
  }

  // ========================================
  // MOVIE TESTS
  // ========================================

  testGetMovie() {
    console.log('🎬 Testing getMovie(1)...');
    this.movieService.getMovie(1).subscribe({
      next: (movie) => {
        console.log('✅ Película obtenida:', movie);
        this.results.set(JSON.stringify(movie, null, 2));
      },
      error: (err) => {
        console.error('❌ Error al obtener película:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  testSearchMovies() {
    console.log('🔍 Testing searchMovies...');
    this.movieService.searchMovies({
      query: 'The',
      limit: 10
    }).subscribe({
      next: (response) => {
        console.log('✅ Búsqueda completada:', response);
        console.log(`Encontradas ${response.total} películas`);
        this.results.set(JSON.stringify(response, null, 2));
      },
      error: (err) => {
        console.error('❌ Error en búsqueda:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  testTopMovies() {
    console.log('🏆 Testing getTopMovies...');
    this.movieService.getTopMovies({ limit: 10 }).subscribe({
      next: (movies) => {
        console.log('✅ Top películas obtenidas:', movies);
        console.log(`Total: ${movies.length} películas`);
        this.results.set(JSON.stringify(movies, null, 2));
      },
      error: (err) => {
        console.error('❌ Error al obtener top películas:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  // ========================================
  // RATING TESTS
  // ========================================

  testCreateRating() {
    console.log('⭐ Testing createRating...');

    if (!this.authService.isAuthenticatedUser()) {
      alert('Debes hacer login primero');
      return;
    }

    this.ratingService.createMyRating({
      movieId: 1,
      rating: 4.5
    }).subscribe({
      next: (rating) => {
        console.log('✅ Rating guardado:', rating);
        this.results.set(JSON.stringify(rating, null, 2));
      },
      error: (err) => {
        console.error('❌ Error al guardar rating:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  testGetMyRatings() {
    console.log('📋 Testing getMyRatings...');

    if (!this.authService.isAuthenticatedUser()) {
      alert('Debes hacer login primero');
      return;
    }

    this.ratingService.getMyRatings().subscribe({
      next: (response) => {
        console.log('✅ Mis ratings obtenidos:', response);
        console.log(`Total: ${response.total} ratings`);
        this.results.set(JSON.stringify(response, null, 2));
      },
      error: (err) => {
        console.error('❌ Error al obtener ratings:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  // ========================================
  // RECOMMENDATION TESTS
  // ========================================

  testGetRecommendations() {
    console.log('🎯 Testing getMyRecommendations...');

    if (!this.authService.isAuthenticatedUser()) {
      alert('Debes hacer login primero');
      return;
    }

    this.ratingService.getMyRatings().subscribe({
      next: (response) => {
        console.log('✅ Recomendaciones obtenidas:', response);
        this.results.set(JSON.stringify(response, null, 2));
      },
      error: (err) => {
        console.error('❌ Error al obtener recomendaciones:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  testGetRecommendationsRefresh() {
    console.log('🔄 Testing getMyRecommendations (refresh)...');

    if (!this.authService.isAuthenticatedUser()) {
      alert('Debes hacer login primero');
      return;
    }

    this.recService.getMyRecommendations({ k: 20, refresh: true }).subscribe({
      next: (response) => {
        console.log('✅ Recomendaciones (refresh) obtenidas:', response);
        console.log(`From cache: ${response.fromCache}`);
        this.results.set(JSON.stringify(response, null, 2));
      },
      error: (err) => {
        console.error('❌ Error al obtener recomendaciones:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      }
    });
  }

  testWebSocket() {
    console.log('🔌 Testing WebSocket...');

    if (!this.authService.isAdminUser()) {
      alert('Debes hacer login como admin primero');
      return;
    }

    const messages: any[] = [];

    this.recService.connectRecommendationWS(1, 20).subscribe({
      next: (message) => {
        console.log('📨 WS Message:', message);
        messages.push(message);
        this.results.set(JSON.stringify(messages, null, 2));
      },
      error: (err) => {
        console.error('❌ WebSocket error:', err);
        this.results.set('Error: ' + JSON.stringify(err, null, 2));
      },
      complete: () => {
        console.log('✅ WebSocket cerrado');
      }
    });
  }
}
