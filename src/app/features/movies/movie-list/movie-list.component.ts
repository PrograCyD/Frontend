import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { Movie, MovieSearchResponse } from '../../../models';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="movie-list-container">
      <header class="header">
        <h1><span class="material-icons">movie</span> Catálogo de Películas</h1>

        <div class="search-bar">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Buscar películas..."
            class="search-input"
          />
          <button (click)="onSearch()" class="search-btn">
            <span class="material-icons">search</span> Buscar
          </button>
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
            <span class="material-icons">star</span> Top Rated
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
                <div class="no-poster">
                  <span class="material-icons">movie</span>
                </div>
              }
            </div>
            <div class="movie-info">
              <h3>{{ movie.title }}</h3>
              <div class="movie-meta">
                <span class="year">{{ extractYear(movie.releaseDate) }}</span>
                @if (movie.averageRating) {
                  <span class="rating">
                    <span class="material-icons">star</span> {{ movie.averageRating.toFixed(1) }}
                  </span>
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
    /* deja el resto de estilos como ya los tienes */
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
  totalMovies = signal(0);

  private readonly pageSize = 20;

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

    // TOP: por ahora solo primera página, sin "load more"
    if (this.viewMode() === 'top') {
      this.movieService.getTopMovies({ limit: this.pageSize }).subscribe({
        next: (movies: Movie[]) => {
          this.movies.set(movies);
          this.hasMore.set(false);
          this.totalMovies.set(movies.length);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar películas');
          this.isLoading.set(false);
        }
      });
      return;
    }

    // TODAS: /movies/search con paginación
    const offset = (this.currentPage - 1) * this.pageSize;

    this.movieService.searchMovies({
      q: this.searchQuery || '',
      limit: this.pageSize,
      offset
    }).subscribe({
      next: (response: MovieSearchResponse) => {
        const newMovies = response.movies;

        if (this.currentPage === 1) {
          this.movies.set(newMovies);
        } else {
          this.movies.update(prev => [...prev, ...newMovies]);
        }

        this.totalMovies.set(response.total);
        this.hasMore.set(this.movies().length < response.total);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar películas');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    const term = this.searchQuery.trim();

    this.currentPage = 1;

    if (this.viewMode() === 'top') {
      // si estás en TOP y escribes, cambia a ALL
      this.viewMode.set('all');
    }

    if (!term) {
      this.loadMovies();
      return;
    }

    this.loadMovies();
  }

  setViewMode(mode: 'all' | 'top'): void {
    this.viewMode.set(mode);
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadMovies();
  }

  loadMore(): void {
    if (!this.hasMore() || this.isLoading()) return;
    this.currentPage++;
    this.loadMovies();
  }
}
