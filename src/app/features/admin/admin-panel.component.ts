import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { RecommendationService } from '../../services/recommendation.service'; // ⏳ COMENTADO: Requiere backend
import { Recommendation } from '../../models';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-panel-container">
      <header class="header">
        <div class="mock-badge">
          <span class="material-icons">science</span> MODO MOCK - Vista de Demostración
        </div>
        <h1><span class="material-icons">admin_panel_settings</span> Panel de Administración</h1>
        <p class="subtitle">Gestión de recomendaciones y mantenimiento del sistema</p>
        <p class="warning-note">
          <span class="material-icons">warning</span> Las funcionalidades de WebSocket y mantenimiento están deshabilitadas hasta integrar el backend
        </p>
      </header>

      <div class="admin-sections">
        <!-- Sección: Recomendaciones de Usuario -->
        <div class="admin-card">
          <h2><span class="material-icons">recommend</span> Recomendaciones de Usuario</h2>
          <p>Genera recomendaciones para un usuario específico mediante WebSocket</p>

          <div class="form-group">
            <label for="userId">ID de Usuario</label>
            <input
              id="userId"
              type="text"
              [(ngModel)]="targetUserId"
              placeholder="Ej: 507f1f77bcf86cd799439011"
              class="input"
            />
          </div>

          <div class="ws-controls">
            <button
              (click)="connectUserWebSocket()"
              [disabled]="!targetUserId || wsConnected()"
              class="btn-primary"
            >
              <span class="material-icons">power</span> Conectar WebSocket
            </button>

            <button
              (click)="disconnectUserWebSocket()"
              [disabled]="!wsConnected()"
              class="btn-secondary"
            >
              <span class="material-icons">power_off</span> Desconectar
            </button>
          </div>

          @if (wsConnected()) {
            <div class="status-box connected">
              ✅ WebSocket conectado para usuario: {{ targetUserId }}
            </div>
          }

          @if (wsError()) {
            <div class="status-box error">
              ❌ {{ wsError() }}
            </div>
          }

          @if (userRecommendations().length > 0) {
            <div class="recommendations-preview">
              <h3>Recomendaciones recibidas ({{ userRecommendations().length }})</h3>
              <div class="rec-list">
                @for (rec of userRecommendations().slice(0, 5); track rec.movieId) {
                  <div class="rec-item">
                    <span class="rank">#{{ $index + 1 }}</span>
                    <span class="movie-id">{{ rec.movieId }}</span>
                    <span class="prediction">⭐ {{ rec.score.toFixed(2) }}</span>
                  </div>
                }
                @if (userRecommendations().length > 5) {
                  <p class="more-text">... y {{ userRecommendations().length - 5 }} más</p>
                }
              </div>
            </div>
          }
        </div>

        <!-- Sección: Mantenimiento del Sistema -->
        <div class="admin-card">
          <h2>🔧 Mantenimiento del Sistema</h2>
          <p>Operaciones de mantenimiento y limpieza</p>

          <div class="maintenance-actions">
            <button (click)="clearCache()" [disabled]="isProcessing()" class="btn-warning">
              🗑️ Limpiar Caché
            </button>

            <button (click)="rebuildSimilarities()" [disabled]="isProcessing()" class="btn-warning">
              🔄 Reconstruir Similitudes
            </button>

            <button (click)="reindexMovies()" [disabled]="isProcessing()" class="btn-warning">
              📊 Reindexar Películas
            </button>
          </div>

          @if (isProcessing()) {
            <div class="status-box processing">
              ⏳ Procesando operación...
            </div>
          }

          @if (maintenanceMessage()) {
            <div class="status-box success">
              ✅ {{ maintenanceMessage() }}
            </div>
          }
        </div>

        <!-- Sección: Estadísticas del Sistema -->
        <div class="admin-card">
          <h2>📊 Estadísticas del Sistema</h2>

          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ stats().totalUsers }}</div>
              <div class="stat-label">Usuarios Totales</div>
            </div>

            <div class="stat-item">
              <div class="stat-value">{{ stats().totalMovies }}</div>
              <div class="stat-label">Películas</div>
            </div>

            <div class="stat-item">
              <div class="stat-value">{{ stats().totalRatings }}</div>
              <div class="stat-label">Valoraciones</div>
            </div>

            <div class="stat-item">
              <div class="stat-value">{{ stats().totalRecommendations }}</div>
              <div class="stat-label">Recomendaciones</div>
            </div>
          </div>

          <button (click)="refreshStats()" [disabled]="isLoadingStats()" class="btn-secondary">
            🔄 Actualizar Estadísticas
          </button>
        </div>

        <!-- Sección: Nodos ML -->
        <div class="admin-card">
          <h2>🖥️ Nodos ML</h2>
          <p>Estado de los nodos de Machine Learning</p>

          <div class="nodes-list">
            @for (node of mlNodes(); track node.address) {
              <div class="node-item" [class.online]="node.status === 'online'" [class.offline]="node.status === 'offline'">
                <span class="node-status">
                  @if (node.status === 'online') {
                    🟢
                  } @else {
                    🔴
                  }
                </span>
                <span class="node-address">{{ node.address }}</span>
                <span class="node-label">{{ node.status }}</span>
              </div>
            }
          </div>

          <button (click)="checkNodesHealth()" [disabled]="isCheckingNodes()" class="btn-secondary">
            🔍 Verificar Salud de Nodos
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-panel-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: var(--background, #0a0a0a);
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
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
      margin: 1rem auto;
      max-width: 600px;
      font-size: 0.875rem;
    }

    h1 {
      color: var(--foreground, #ffffff);
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: var(--muted-foreground, #a0a0a0);
      margin: 0;
    }

    .admin-sections {
      display: grid;
      gap: 2rem;
    }

    .admin-card {
      background: var(--card, #1a1a1a);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border, rgba(255, 107, 53, 0.2));
    }

    .admin-card h2 {
      margin: 0 0 0.5rem 0;
      color: var(--foreground, #ffffff);
    }

    .admin-card > p {
      color: var(--muted-foreground, #a0a0a0);
      margin: 0 0 1.5rem 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--foreground, #ffffff);
      font-weight: 600;
    }

    .input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border, rgba(255, 107, 53, 0.2));
      border-radius: 0.5rem;
      font-size: 1rem;
      box-sizing: border-box;
      background: var(--input-background, #1a1a1a);
      color: var(--foreground, #ffffff);
    }

    .input:focus {
      outline: none;
      border-color: var(--primary, #ff6b35);
    }

    .ws-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: var(--primary, #ff6b35);
      color: var(--primary-foreground, #000000);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-hover, #ff8c42);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: var(--card, #1a1a1a);
      color: var(--primary, #ff6b35);
      border: 2px solid var(--primary, #ff6b35);
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--primary, #ff6b35);
      color: var(--primary-foreground, #000000);
    }

    .btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-warning {
      padding: 0.75rem 1.5rem;
      background: var(--secondary, #ff8c42);
      color: var(--secondary-foreground, #000000);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      margin-right: 1rem;
      margin-bottom: 1rem;
    }

    .btn-warning:hover:not(:disabled) {
      background: var(--primary, #ff6b35);
    }

    .btn-warning:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .status-box {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
      font-weight: 600;
    }

    .status-box.connected {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status-box.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .status-box.processing {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }

    .status-box.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .recommendations-preview {
      margin-top: 1.5rem;
      padding: 1rem;
      background: var(--muted, #2a2a2a);
      border-radius: 0.5rem;
    }

    .recommendations-preview h3 {
      margin: 0 0 1rem 0;
      color: var(--foreground, #ffffff);
    }

    .rec-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .rec-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: var(--card, #1a1a1a);
      border-radius: 0.25rem;
    }

    .rank {
      font-weight: bold;
      color: var(--primary, #ff6b35);
    }

    .movie-id {
      flex: 1;
      margin: 0 1rem;
      color: var(--muted-foreground, #a0a0a0);
      font-family: monospace;
    }

    .prediction {
      color: var(--secondary, #ff8c42);
      font-weight: bold;
    }

    .more-text {
      text-align: center;
      color: var(--muted-foreground, #a0a0a0);
      margin: 0.5rem 0 0 0;
    }

    .maintenance-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      text-align: center;
      padding: 1.5rem;
      background: var(--muted, #2a2a2a);
      border-radius: 0.5rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--primary, #ff6b35);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--muted-foreground, #a0a0a0);
      font-size: 0.875rem;
    }

    .nodes-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .node-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--muted, #2a2a2a);
      border-radius: 0.5rem;
      border-left: 4px solid var(--border, rgba(255, 107, 53, 0.2));
    }

    .node-item.online {
      border-left-color: #28a745;
    }

    .node-item.offline {
      border-left-color: #dc3545;
    }

    .node-status {
      font-size: 1.5rem;
    }

    .node-address {
      flex: 1;
      font-family: monospace;
      color: var(--foreground, #ffffff);
    }

    .node-label {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .node-item.online .node-label {
      color: #28a745;
    }

    .node-item.offline .node-label {
      color: #dc3545;
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  // private recommendationService = RecommendationService; // ⏳ COMENTADO: Requiere backend

  targetUserId = '';
  userRecommendations = signal<Recommendation[]>([]);
  wsConnected = signal(false);
  wsError = signal('');
  isProcessing = signal(false);
  maintenanceMessage = signal('');
  isLoadingStats = signal(false);
  isCheckingNodes = signal(false);

  stats = signal({
    totalUsers: 1250,
    totalMovies: 58098,
    totalRatings: 25000000,
    totalRecommendations: 12500
  });

  mlNodes = signal([
    { address: 'mlnode1:9001', status: 'online' as const },
    { address: 'mlnode2:9001', status: 'online' as const },
    { address: 'mlnode3:9001', status: 'online' as const },
    { address: 'mlnode4:9001', status: 'offline' as const }
  ]);

  // constructor() {
  //   this.recommendationService = new RecommendationService(); // ⏳ COMENTADO: Requiere backend
  // }

  ngOnInit(): void {
    this.refreshStats();
  }

  // ⏳ COMENTADO: Requiere backend con WebSocket
  connectUserWebSocket(): void {
    if (!this.targetUserId) return;

    this.wsError.set('⚠️ WebSocket no disponible en modo MOCK. Integra el backend para usar esta funcionalidad.');
    this.wsConnected.set(false);

    /* // Código original - requiere backend
    this.wsError.set('');
    this.wsConnected.set(false);

    this.recommendationService.connectWebSocket(this.targetUserId).subscribe({
      next: (recommendations: Recommendation[]) => {
        console.log('📡 Admin WS: Recomendaciones recibidas', recommendations);
        this.userRecommendations.set(recommendations);
        this.wsConnected.set(true);
      },
      error: (error: any) => {
        console.error('❌ Admin WS error:', error);
        this.wsError.set('Error al conectar WebSocket');
        this.wsConnected.set(false);
      }
    });
    */
  }

  // ⏳ COMENTADO: Requiere backend con WebSocket
  disconnectUserWebSocket(): void {
    this.wsConnected.set(false);
    this.userRecommendations.set([]);
    // this.recommendationService.disconnectWebSocket(); // ⏳ COMENTADO: Requiere backend
  }

  // 🧪 MOCK: Simula limpieza de caché
  clearCache(): void {
    this.isProcessing.set(true);
    this.maintenanceMessage.set('');

    setTimeout(() => {
      this.maintenanceMessage.set('🧪 MOCK: Caché "limpiado" exitosamente (simulado)');
      this.isProcessing.set(false);
    }, 2000);
  }

  // 🧪 MOCK: Simula reconstrucción de similitudes
  rebuildSimilarities(): void {
    this.isProcessing.set(true);
    this.maintenanceMessage.set('');

    setTimeout(() => {
      this.maintenanceMessage.set('🧪 MOCK: Similitudes "reconstruidas" exitosamente (simulado)');
      this.isProcessing.set(false);
    }, 3000);
  }

  // 🧪 MOCK: Simula reindexación de películas
  reindexMovies(): void {
    this.isProcessing.set(true);
    this.maintenanceMessage.set('');

    setTimeout(() => {
      this.maintenanceMessage.set('🧪 MOCK: Películas "reindexadas" exitosamente (simulado)');
      this.isProcessing.set(false);
    }, 2500);
  }

  // 🧪 MOCK: Simula actualización de estadísticas
  refreshStats(): void {
    this.isLoadingStats.set(true);

    setTimeout(() => {
      // Simular actualización de stats con datos de prueba
      this.stats.set({
        totalUsers: Math.floor(Math.random() * 2000) + 1000,
        totalMovies: 58098,
        totalRatings: Math.floor(Math.random() * 30000000) + 20000000,
        totalRecommendations: Math.floor(Math.random() * 20000) + 10000
      });
      this.isLoadingStats.set(false);
    }, 1000);
  }

  // 🧪 MOCK: Simula verificación de salud de nodos ML
  checkNodesHealth(): void {
    this.isCheckingNodes.set(true);

    setTimeout(() => {
      // Simular verificación de nodos con cambios aleatorios
      const nodes = this.mlNodes();
      nodes.forEach(node => {
        node.status = Math.random() > 0.2 ? 'online' : 'offline';
      });
      this.mlNodes.set([...nodes]);
      this.isCheckingNodes.set(false);
    }, 1500);
  }
}
