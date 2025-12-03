import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// import { RecommendationService } from '../../services/recommendation.service'; // ⏳ COMENTADO: Requiere backend
import { Recommendation } from '../../models';
import { mockMovies } from '../../data/mock-movies';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="recommendations-container">
      <header class="header">
        <div class="mock-badge">🧪 MODO MOCK - Vista de Demostración</div>
        <h1>🎯 Tus Recomendaciones Personalizadas</h1>
        <p class="subtitle">Basadas en tus valoraciones anteriores</p>
        <p class="warning-note">⚠️ Las recomendaciones WebSocket en tiempo real están deshabilitadas hasta integrar el backend</p>
      </header>

      <div class="controls">
        <button
          (click)="showMockMessage()"
          class="ws-toggle disabled"
          disabled
        >
          🔴 WebSocket (No disponible en MOCK)
        </button>

        <button (click)="refreshRecommendations()" [disabled]="isLoading()" class="refresh-btn">
          🔄 Actualizar Recomendaciones MOCK
        </button>
      </div>

      @if (mockMessage()) {
        <div class="alert alert-info">
          {{ mockMessage() }}
        </div>
      }

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Generando recomendaciones MOCK...</p>
        </div>
      }

      @if (recommendations().length === 0 && !isLoading()) {
        <div class="empty-state">
          <div class="empty-icon">🎬</div>
          <h2>No hay recomendaciones disponibles</h2>
          <p>🧪 En modo MOCK, las recomendaciones se generan aleatoriamente</p>
          <a routerLink="/home" class="cta-btn">Explorar películas</a>
        </div>
      }

      @if (recommendations().length > 0) {
        <div class="recommendations-list">
          @for (rec of recommendations(); track rec.movieId) {
            <div class="recommendation-card" [routerLink]="['/movies', rec.movieId]">
              <div class="rank">
                #{{ $index + 1 }}
              </div>

              <div class="movie-poster">
                @if (rec.posterUrl) {
                  <img [src]="rec.posterUrl" [alt]="rec.title || 'Película'" />
                } @else {
                  <div class="no-poster">🎬</div>
                }
              </div>

              <div class="movie-info">
                <h3>{{ rec.title || 'Película ' + rec.movieId }}</h3>

                @if (rec.genres && rec.genres.length > 0) {
                  <div class="genres">
                    @for (genre of rec.genres.slice(0, 3); track genre) {
                      <span class="genre-tag">{{ genre }}</span>
                    }
                  </div>
                }

                <div class="prediction">
                  <span class="label">Score:</span>
                  <span class="value">⭐ {{ rec.score.toFixed(2) }}</span>
                </div>

                @if (rec.reason) {
                  <div class="explanation">
                    <p><strong>Por qué te recomendamos esto:</strong></p>
                    <p>{{ rec.reason }}</p>
                  </div>
                }

              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .recommendations-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: var(--background, #0a0a0a);
    }

    .mock-badge {
      display: inline-block;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15));
      color: #f59e0b;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
      border: 2px solid rgba(245, 158, 11, 0.3);
    }

    .warning-note {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border-left: 4px solid #dc2626;
      margin: 1rem 0;
      font-size: 0.875rem;
    }

    .alert-info {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
      padding: 1rem;
      border-radius: 0.5rem;
      border-left: 4px solid #2563eb;
      margin: 1rem 0;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    h1 {
      color: var(--foreground, #ffffff);
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: var(--muted-foreground, #a0a0a0);
      margin: 0;
    }

    .controls {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .ws-toggle {
      padding: 0.75rem 1.5rem;
      border: 2px solid var(--primary, #ff6b35);
      background: var(--card, #1a1a1a);
      color: var(--primary, #ff6b35);
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .ws-toggle.active {
      background: var(--primary, #ff6b35);
      color: var(--primary-foreground, #000000);
    }

    .ws-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
    }

    .refresh-btn {
      padding: 0.75rem 1.5rem;
      background: var(--primary, #ff6b35);
      color: var(--primary-foreground, #000000);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
    }

    .refresh-btn:hover:not(:disabled) {
      background: var(--primary-hover, #ff8c42);
    }

    .refresh-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ws-status {
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    .ws-status.connected {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .ws-status.connecting {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      border: 4px solid var(--muted, #2a2a2a);
      border-top: 4px solid var(--primary, #ff6b35);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .alert-error {
      background: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }

    .empty-state h2 {
      color: var(--foreground, #ffffff);
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--muted-foreground, #a0a0a0);
      margin-bottom: 2rem;
    }

    .cta-btn {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: var(--primary, #ff6b35);
      color: var(--primary-foreground, #000000);
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 600;
    }

    .cta-btn:hover {
      background: var(--primary-hover, #ff8c42);
    }

    .recommendations-list {
      display: grid;
      gap: 1.5rem;
    }

    .recommendation-card {
      display: grid;
      grid-template-columns: auto 200px 1fr;
      gap: 1.5rem;
      background: var(--card, #1a1a1a);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border, rgba(255, 107, 53, 0.2));
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      align-items: start;
    }

    .recommendation-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(255, 107, 53, 0.3);
    }

    @media (max-width: 768px) {
      .recommendation-card {
        grid-template-columns: 1fr;
      }
    }

    .rank {
      font-size: 2rem;
      font-weight: bold;
      color: var(--primary, #ff6b35);
      min-width: 60px;
      text-align: center;
    }

    .movie-poster {
      width: 200px;
      aspect-ratio: 2/3;
      border-radius: 0.5rem;
      overflow: hidden;
      background: var(--muted, #2a2a2a);
    }

    .movie-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-poster {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      color: #ccc;
    }

    .movie-info h3 {
      margin: 0 0 1rem 0;
      color: var(--foreground, #ffffff);
      font-size: 1.5rem;
    }

    .genres {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .genre-tag {
      padding: 0.25rem 0.75rem;
      background: var(--muted, #2a2a2a);
      border-radius: 0.25rem;
      font-size: 0.875rem;
      color: var(--muted-foreground, #a0a0a0);
    }

    .prediction {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: var(--muted, #2a2a2a);
      border-radius: 0.5rem;
    }

    .prediction .label {
      color: var(--muted-foreground, #a0a0a0);
      font-weight: 600;
    }

    .prediction .value {
      color: var(--secondary, #ff8c42);
      font-size: 1.25rem;
      font-weight: bold;
    }

    .explanation {
      padding: 1rem;
      background: rgba(255, 107, 53, 0.1);
      border-left: 4px solid var(--primary, #ff6b35);
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .explanation p {
      margin: 0.5rem 0 0 0;
      color: var(--muted-foreground, #a0a0a0);
      line-height: 1.5;
    }

    .explanation strong {
      color: var(--foreground, #ffffff);
    }

    .timestamp {
      color: var(--muted-foreground, #a0a0a0);
      font-size: 0.875rem;
    }
  `]
})
export class RecommendationsComponent implements OnInit {
  // private recommendationService = RecommendationService; // ⏳ COMENTADO: Requiere backend

  recommendations = signal<Recommendation[]>([]);
  isLoading = signal(false);
  mockMessage = signal('');

  // constructor() {
  //   this.recommendationService = new RecommendationService(); // ⏳ COMENTADO: Requiere backend
  // }

  ngOnInit(): void {
    this.loadMockRecommendations();
  }

  // 🧪 MOCK: Genera recomendaciones de prueba aleatorias
  loadMockRecommendations(): void {
    this.isLoading.set(true);
    this.mockMessage.set('');

    // Simula tiempo de carga
    setTimeout(() => {
      const shuffled = [...mockMovies].sort(() => 0.5 - Math.random());
      const topMovies = shuffled.slice(0, 8);

      const mockRecs: Recommendation[] = topMovies.map((movie, index) => ({
        movieId: movie.movieId,
        score: parseFloat((4.5 - index * 0.1).toFixed(2)),
        title: movie.title,
        reason: `Recomendada por tus gustos en ${movie.genres.slice(0, 2).join(' y ')}`,
        posterUrl: movie.posterPath,
        genres: movie.genres,
        voteAverage: movie.voteAverage
      }));

      this.recommendations.set(mockRecs);
      this.isLoading.set(false);
    }, 800);

    /* // Código original - requiere backend
    this.recommendationService.getMyRecommendations().subscribe({
      next: (recommendations: Recommendation[]) => {
        this.recommendations.set(recommendations);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        this.errorMessage.set('Error al cargar recomendaciones');
        this.isLoading.set(false);
      }
    });
    */
  }

  // 🧪 MOCK: Refresca las recomendaciones
  refreshRecommendations(): void {
    this.loadMockRecommendations();
  }

  // 🧪 MOCK: Muestra mensaje sobre WebSocket
  showMockMessage(): void {
    this.mockMessage.set('🧪 WebSocket no disponible en modo MOCK. Esta funcionalidad requiere conexión al backend para recibir recomendaciones en tiempo real.');
    setTimeout(() => this.mockMessage.set(''), 5000);
  }

  /* // ⏳ COMENTADO: Código original requiere backend con WebSocket
  ngOnDestroy(): void {
    if (this.wsEnabled()) {
      this.recommendationService.disconnectWebSocket();
    }
  }

  toggleWebSocket(): void {
    if (this.wsEnabled()) {
      this.recommendationService.disconnectWebSocket();
      this.wsEnabled.set(false);
      this.wsConnected.set(false);
    } else {
      this.wsEnabled.set(true);
      this.recommendationService.connectWebSocket().subscribe({
        next: (recommendations: Recommendation[]) => {
          console.log('📡 WebSocket: Nueva recomendación recibida', recommendations);
          this.recommendations.set(recommendations);
          this.wsConnected.set(true);
        },
        error: (error: any) => {
          console.error('❌ WebSocket error:', error);
          this.errorMessage.set('Error en conexión WebSocket');
          this.wsEnabled.set(false);
          this.wsConnected.set(false);
        }
      });
    }
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  */
}
