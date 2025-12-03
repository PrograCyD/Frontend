import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { Movie } from '../../../models';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="movie-list-container">
      <header class="header">
        <h1>🎬 Catálogo de Películas</h1>

        <div class="search-bar">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Buscar películas..."
            class="search-input"
          />
          <button (click)="onSearch()" class="search-btn">🔍 Buscar</button>
        </div>

        <div class="filters">
          <button
            [class.active]="viewMode() === 'all'"
            (click)="setViewMode('all')"
          >
            Todas
          </button>
          <button
            [class.active]="viewMode() === 'top'"
            (click)="setViewMode('top')"
          >
            ⭐ Top Rated
          </button>
        </div>
      </header>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Cargando películas...</p>
        </div>
      }

      @if (errorMessage()) {
        <div class="alert alert-error">
          {{ errorMessage() }}
        </div>
      }

      @if (!isLoading() && movies().length === 0) {
        <div class="empty-state">
          <p>No se encontraron películas</p>
        </div>
      }

      <div class="movies-grid">
        @for (movie of movies(); track movie.movieId) {
          <div class="movie-card" [routerLink]="['/movies', movie.movieId]">
            <div class="movie-poster">
              @if (movie.posterPath || movie.posterUrl) {
                <img [src]="movie.posterPath || movie.posterUrl" [alt]="movie.title" />
              } @else {
                <div class="no-poster">🎬</div>
              }
            </div>
            <div class="movie-info">
              <h3>{{ movie.title }}</h3>
              <div class="movie-meta">
                <span class="year">{{ extractYear(movie.releaseDate) }}</span>
                @if (movie.averageRating) {
                  <span class="rating">⭐ {{ movie.averageRating.toFixed(1) }}</span>
                }
              </div>
              @if (movie.genres && movie.genres.length > 0) {
                <div class="genres">
                  @for (genre of movie.genres.slice(0, 3); track genre) {
                    <span class="genre-tag">{{ genre }}</span>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>

      @if (hasMore()) {
        <div class="load-more">
          <button (click)="loadMore()" [disabled]="isLoading()">
            Cargar más
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .movie-list-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      margin-bottom: 2rem;
    }

    h1 {
      color: #333;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .search-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 2px solid #ddd;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .search-btn {
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
    }

    .search-btn:hover {
      background: #5568d3;
    }

    .filters {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .filters button {
      padding: 0.5rem 1.5rem;
      border: 2px solid #ddd;
      background: white;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .filters button:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .filters button.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
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
      color: #666;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .movie-card {
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .movie-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }

    .movie-poster {
      width: 100%;
      aspect-ratio: 2/3;
      overflow: hidden;
      background: #f0f0f0;
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

    .movie-info {
      padding: 1rem;
    }

    .movie-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .movie-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #666;
    }

    .rating {
      color: #f39c12;
      font-weight: 600;
    }

    .genres {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .genre-tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background: #f0f0f0;
      border-radius: 0.25rem;
      color: #666;
    }

    .load-more {
      text-align: center;
      padding: 2rem;
    }

    .load-more button {
      padding: 0.75rem 2rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
    }

    .load-more button:hover:not(:disabled) {
      background: #5568d3;
    }

    .load-more button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  searchQuery = '';
  viewMode = signal<'all' | 'top'>('all');
  hasMore = signal(false);
  currentPage = 1;

  ngOnInit(): void {
    this.loadMovies();
  }

  extractYear(releaseDate?: string): string {
    if (!releaseDate) return 'N/A';
    const year = releaseDate.split('-')[0];
    return year || 'N/A';
  }

  loadMovies(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    if (this.viewMode() === 'top') {
      this.movieService.getTopMovies({ limit: 20 }).subscribe({
        next: (movies: Movie[]) => {
          this.movies.set(movies);
          this.hasMore.set(false);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          this.errorMessage.set('Error al cargar películas');
          this.isLoading.set(false);
        }
      });
    } else {
      // Por ahora mostramos todas las películas mock
      this.movieService.getTopMovies({ limit: 100 }).subscribe({
        next: (movies: Movie[]) => {
          this.movies.set(movies);
          this.hasMore.set(false);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          this.errorMessage.set('Error al cargar películas');
          this.isLoading.set(false);
        }
      });
    }
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.loadMovies();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.movieService.searchMovies({ query: this.searchQuery }).subscribe({
      next: (response: any) => {
        this.movies.set(response.movies || response);
        this.hasMore.set(false);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        this.errorMessage.set('Error al buscar películas');
        this.isLoading.set(false);
      }
    });
  }

  setViewMode(mode: 'all' | 'top'): void {
    this.viewMode.set(mode);
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadMovies();
  }

  loadMore(): void {
    this.currentPage++;
    // TODO: Implementar paginación cuando el backend lo soporte
  }
}
