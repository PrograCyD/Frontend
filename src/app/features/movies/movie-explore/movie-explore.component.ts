import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieExtended } from '../../../models/movie.model';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { MovieService } from '@app/services';

@Component({
  selector: 'app-movie-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent],
  templateUrl: './movie-explore.component.html',
  styleUrl: './movie-explore.component.css'
})
export class MovieExploreComponent implements OnInit {
  // Filtros -> /movies/search
  searchQuery = signal('');                    // q
  selectedGenre = signal<string | null>(null); // genre
  yearFrom = signal<number | null>(null);      // year_from
  yearTo = signal<number | null>(null);        // year_to

  // Paginación
  pageSize   = signal(20);     // limit por página
  currentPage = signal(1);     // página actual (1-based)
  totalMovies = signal(0);     // total que reporta el backend (si lo reporta)

  movies = signal<MovieExtended[]>([]);
  showFilters = signal(false);

  // ---------- COMPUTED ----------

  // total de páginas sólo si tenemos total fiable
  totalPages = computed(() => {
    const total = this.totalMovies();
    const size = this.pageSize();
    if (total <= 0 || size <= 0) {
      // sin total usamos la página actual como fallback
      return this.currentPage();
    }
    return Math.max(1, Math.ceil(total / size));
  });

  // ¿hay siguiente página?
  hasNextPage = computed(() => {
    const total = this.totalMovies();
    const size = this.pageSize();
    const current = this.currentPage();

    if (total > 0 && size > 0) {
      const pages = Math.ceil(total / size);
      return current < pages;
    }

    // Fallback cuando el backend NO da total o lo da mal:
    // si la página viene llena (movies.length === limit),
    // asumimos que puede haber más.
    return this.movies().length === size;
  });

  // géneros (de la página actual)
  allGenres = computed(() => {
    const genres = new Set<string>();
    this.movies().forEach(m => m.genres.forEach(g => genres.add(g)));
    return Array.from(genres).sort();
  });

  activeFiltersCount = computed(() => {
    let c = 0;
    if (this.selectedGenre()) c++;
    if (this.yearFrom() || this.yearTo()) c++;
    return c;
  });

  // páginas visibles para cuando SÍ tenemos total
  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxToShow = 5;

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxToShow - 1);
    start = Math.max(1, end - maxToShow + 1);

    const pages: number[] = [];
    for (let p = start; p <= end; p++) {
      pages.push(p);
    }
    return pages;
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.searchQuery.set(params['q']);
      if (params['genre']) this.selectedGenre.set(params['genre']);
      if (params['year_from']) this.yearFrom.set(+params['year_from']);
      if (params['year_to']) this.yearTo.set(+params['year_to']);

      this.currentPage.set(1);
      this.loadMoviesFromBackend();
    });

    // si no había params al inicio
    if (!this.route.snapshot.queryParams ||
        Object.keys(this.route.snapshot.queryParams).length === 0) {
      this.loadMoviesFromBackend();
    }
  }

  // ---------- HANDLERS ----------

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
    this.loadMoviesFromBackend();
  }

  toggleFilters(): void {
    this.showFilters.update(v => !v);
  }

  onGenreChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedGenre.set(select.value || null);
    this.currentPage.set(1);
    this.loadMoviesFromBackend();
  }

  onYearFromChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value ? parseInt(input.value, 10) : null;
    this.yearFrom.set(value);
    this.currentPage.set(1);
    this.loadMoviesFromBackend();
  }

  onYearToChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value ? parseInt(input.value, 10) : null;
    this.yearTo.set(value);
    this.currentPage.set(1);
    this.loadMoviesFromBackend();
  }

  clearGenre(): void {
    this.selectedGenre.set(null);
    this.currentPage.set(1);
    this.loadMoviesFromBackend();
  }

  clearYears(): void {
    this.yearFrom.set(null);
    this.yearTo.set(null);
    this.currentPage.set(1);
    this.loadMoviesFromBackend();
  }

  clearAllFilters(): void {
    this.selectedGenre.set(null);
    this.searchQuery.set('');
    this.yearFrom.set(null);
    this.yearTo.set(null);
    this.currentPage.set(1);
    this.loadMoviesFromBackend();
  }

  onMovieClick(movie: MovieExtended): void {
    this.router.navigate(['/movies', movie.movieId]);
  }

  // ---------- PAGINACIÓN ----------

  prevPage(): void {
    if (this.currentPage() === 1) return;
    this.currentPage.update(p => p - 1);
    this.loadMoviesFromBackend();
  }

  nextPage(): void {
    if (!this.hasNextPage()) return;
    this.currentPage.update(p => p + 1);
    this.loadMoviesFromBackend();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadMoviesFromBackend();
  }

  // ---------- BACKEND ----------

  private loadMoviesFromBackend(): void {
    const limit = this.pageSize();
    const offset = (this.currentPage() - 1) * limit;

    const params = {
      q: this.searchQuery() || undefined,
      genre: this.selectedGenre() || undefined,
      year_from: this.yearFrom() || undefined,
      year_to: this.yearTo() || undefined,
      limit,
      offset
    };

    this.movieService.searchMovies(params).subscribe({
      next: (response: any) => {
        console.log('searchMovies response', response);

        const movies = response.movies || response.items || response || [];
        this.movies.set(movies);

        // si el backend envía total numérico, lo usamos; si no, 0
        const total = typeof response.total === 'number' ? response.total : 0;
        this.totalMovies.set(total);
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.movies.set([]);
        this.totalMovies.set(0);
      }
    });
  }
}
