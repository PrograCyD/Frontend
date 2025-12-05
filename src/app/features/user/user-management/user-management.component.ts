import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MovieRequestService } from '../../../services/movie-request.service';
import { RatingService } from '../../../services/rating.service';
import { MovieService } from '../../../services/movie.service';
import { ConfirmationService } from '../../../services/confirmation.service';

import {
  MovieRequest,
  Movie,
  Rating,
  CreateMovieRequestParams
} from '../../../models';

import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

interface UserRatingExtended extends Rating {
  movie?: Movie;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  // Tab control
  activeTab = signal<'requests' | 'ratings'>('requests');

  // Requests tab
  myRequests = signal<MovieRequest[]>([]);
  showRequestForm = signal(false);
  formInputMode = signal<'manual' | 'url'>('manual');
  genreDropdownOpen = signal(false);
  isLoadingFromUrl = signal(false);
  urlImportError = signal<string | null>(null);
  urlImportSuccess = signal(false);

  // requestType/movieId: solo UI por ahora (el backend solo agrega películas)
  requestForm = signal({
    requestType: 'add' as 'add' | 'edit',
    movieId: undefined as number | undefined,

    title: '',
    year: new Date().getFullYear(),
    genres: [] as string[],

    movieLensLink: '',
    imdbLink: '',
    tmdbLink: '',

    genomeTags: '',  // CSV -> [{tag, relevance:1}]
    userTags: '',    // CSV -> string[]

    overview: '',
    posterUrl: '',
    director: '',
    runtime: undefined as number | undefined,

    // extras solo UI
    budget: undefined as number | undefined,
    revenue: undefined as number | undefined,
    cast: '',        // "Actor 1, Actor 2" -> CastMember[]
    castUrl: '',
    importUrl: '',
    jsonData: ''
  });

  // ==========================
  // Ratings tab
  // ==========================
  myRatings = signal<UserRatingExtended[]>([]);
  ratingsPage = signal(0);
  ratingsPageSize = signal(10);
  ratingsFilter = signal({
    search: '',
    minRating: 0,
    maxRating: 5
  });

  editingRating = signal<number | null>(null);
  editRatingValue = signal(0);

  // Loading states
  isLoadingRequests = signal(false);
  isLoadingRatings = signal(false);
  isSubmitting = signal(false);

  // Available genres
  availableGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War'
  ];

  // ==========================
  // Helpers para ratings
  // ==========================
  /** Devuelve la lista de ratings ya filtrada (por búsqueda y rango de estrellas) */
  private getFilteredRatings(): UserRatingExtended[] {
    const ratings = this.myRatings();
    const filter = this.ratingsFilter();

    return ratings.filter(r => {
      const title = r.movie?.title?.toLowerCase() || '';
      const search = filter.search.toLowerCase();

      const matchesSearch = !search || title.includes(search);
      const matchesMinRating = r.rating >= filter.minRating;
      const matchesMaxRating = r.rating <= filter.maxRating;

      return matchesSearch && matchesMinRating && matchesMaxRating;
    });
  }

  // Computed
  paginatedRatings = computed(() => {
    const filtered = this.getFilteredRatings();
    const page = this.ratingsPage();
    const pageSize = this.ratingsPageSize();

    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  });

  // 👇 total ahora es derivado, sin escribir dentro del computed
  ratingsTotal = computed(() => this.getFilteredRatings().length);

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.ratingsTotal() / this.ratingsPageSize()))
  );

  // Services
  private movieRequestService = inject(MovieRequestService);
  private ratingService = inject(RatingService);
  private movieService = inject(MovieService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.loadMyRequests();
    this.loadMyRatings();
  }

  // ============================================
  // Helpers privados
  // ============================================

  private extractTmdbId(input: string): string | null {
    const trimmed = input.trim();

    // Solo número
    if (/^\d+$/.test(trimmed)) return trimmed;

    // ?tmdbId=603
    const queryMatch = trimmed.match(/tmdbId=(\d+)/);
    if (queryMatch) return queryMatch[1];

    // https://www.themoviedb.org/movie/603-...
    const urlMatch = trimmed.match(/themoviedb\.org\/movie\/(\d+)/);
    if (urlMatch) return urlMatch[1];

    return null;
  }

  // ============================================
  // TAB NAVIGATION
  // ============================================

  setActiveTab(tab: 'requests' | 'ratings'): void {
    this.activeTab.set(tab);
  }

  // ============================================
  // REQUESTS TAB
  // ============================================

  loadMyRequests(): void {
    this.isLoadingRequests.set(true);

    this.movieRequestService
      .getMyMovieRequests({ status: 'all', limit: 50 })
      .subscribe({
        next: (response) => {
          const requests = Array.isArray(response)
            ? response
            : response.requests;

          this.myRequests.set(requests);
          this.isLoadingRequests.set(false);
        },
        error: (err) => {
          console.error('Error loading requests:', err);
          this.isLoadingRequests.set(false);
        }
      });
  }

  toggleRequestForm(): void {
    this.showRequestForm.set(!this.showRequestForm());
    if (this.showRequestForm()) {
      this.resetRequestForm();
    }
  }

  resetRequestForm(): void {
    this.requestForm.set({
      requestType: 'add',
      movieId: undefined,
      title: '',
      year: new Date().getFullYear(),
      genres: [],
      movieLensLink: '',
      imdbLink: '',
      tmdbLink: '',
      genomeTags: '',
      userTags: '',
      overview: '',
      posterUrl: '',
      director: '',
      runtime: undefined,
      budget: undefined,
      revenue: undefined,
      cast: '',
      castUrl: '',
      importUrl: '',
      jsonData: ''
    });

    this.urlImportError.set(null);
    this.urlImportSuccess.set(false);
  }

  importFromUrl(): void {
    const raw = this.requestForm().importUrl?.trim();
    if (!raw) return;

    this.isLoadingFromUrl.set(true);
    this.urlImportError.set(null);
    this.urlImportSuccess.set(false);

    const tmdbId = this.extractTmdbId(raw);

    if (!tmdbId) {
      this.isLoadingFromUrl.set(false);
      this.urlImportError.set(
        'Por ahora solo se soportan URLs o IDs de TMDb. Ej: https://www.themoviedb.org/movie/603 o solo "603".'
      );
      return;
    }

    this.movieService.getMovieTmdbPrefill(tmdbId).subscribe({
      next: (movieData) => {
        this.requestForm.update(form => ({
          ...form,
          title: movieData.title || '',
          year: movieData.year || new Date().getFullYear(),
          genres: movieData.genres || [],
          overview: movieData.overview || '',
          runtime: movieData.runtime || undefined,
          director: movieData.director || '',
          posterUrl: movieData.posterUrl || '',
          imdbLink: movieData.links?.imdb || '',
          tmdbLink: movieData.links?.tmdb || '',
          userTags: movieData.userTags?.join(', ') || '',
          genomeTags: movieData.genomeTags?.map(gt => gt.tag).join(', ') || ''
        }));

        this.isLoadingFromUrl.set(false);
        this.urlImportSuccess.set(true);
      },
      error: (err) => {
        console.error('Error importing from TMDb prefill:', err);
        this.isLoadingFromUrl.set(false);
        this.urlImportError.set(
          err.error?.message ||
          'No se pudieron obtener los datos desde TMDb. Verifica el ID/URL.'
        );
      }
    });
  }

  toggleGenre(genre: string): void {
    const form = this.requestForm();
    const index = form.genres.indexOf(genre);

    if (index >= 0) {
      form.genres.splice(index, 1);
    } else {
      form.genres.push(genre);
    }

    this.requestForm.set({ ...form });
  }

  toggleGenreDropdown(): void {
    this.genreDropdownOpen.update(v => !v);
  }

  getSelectedGenresText(): string {
    const genres = this.requestForm().genres;
    if (genres.length === 0) return 'Selecciona géneros...';
    if (genres.length === 1) return genres[0];
    return `${genres.length} géneros seleccionados`;
  }

  submitMovieRequest(): void {
    const form = this.requestForm();

    if (!form.title || form.genres.length === 0) {
      alert('Por favor completa al menos el título y selecciona al menos un género');
      return;
    }

    this.isSubmitting.set(true);

    const userTags = form.userTags
      ? form.userTags.split(',').map(t => t.trim()).filter(Boolean)
      : undefined;

    const genomeTags = form.genomeTags
      ? form.genomeTags.split(',').map(t => t.trim()).filter(Boolean)
      : undefined;

    const castDetails = form.cast
      ? form.cast.split(',').map(name => ({ name: name.trim() }))
      : undefined;

    const body: CreateMovieRequestParams = {
      requestType: form.requestType,
      movieId: form.requestType === 'edit'
        ? form.movieId
        : undefined,
      movieData: {
        title: form.title,
        year: form.year,
        genres: form.genres,
        links: {
          movielens: form.movieLensLink || undefined,
          imdb: form.imdbLink || undefined,
          tmdb: form.tmdbLink || undefined
        },
        overview: form.overview || undefined,
        posterUrl: form.posterUrl || undefined,
        director: form.director || undefined,
        budget: form.budget,
        revenue: form.revenue,
        cast: form.cast || undefined,
        castDetails,
        genomeTags,
        userTags,
        jsonData: form.jsonData || undefined
      }
    };

    this.movieRequestService.createMovieRequest(body).subscribe({
      next: () => {
        alert('Solicitud enviada exitosamente');
        this.showRequestForm.set(false);
        this.loadMyRequests();
        this.isSubmitting.set(false);
      },
      error: (err: any) => {
        console.error('Error submitting request:', err);
        alert('Error al enviar la solicitud');
        this.isSubmitting.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'approved': return 'badge-approved';
      case 'rejected': return 'badge-rejected';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  }

  // ============================================
  // RATINGS TAB
  // ============================================

  loadMyRatings(): void {
    this.isLoadingRatings.set(true);

    this.ratingService.getMyRatings().subscribe({
      next: (ratings: Rating[]) => {
        if (!ratings || ratings.length === 0) {
          this.myRatings.set([]);
          this.isLoadingRatings.set(false);
          return;
        }

        const ratingsWithMovies: UserRatingExtended[] = [];
        let loaded = 0;

        ratings.forEach((rating) => {
          this.movieService.getMovie(rating.movieId).subscribe({
            next: (movie) => {
              ratingsWithMovies.push({ ...rating, movie });
              loaded++;

              if (loaded === ratings.length) {
                this.myRatings.set(ratingsWithMovies);
                this.isLoadingRatings.set(false);
              }
            },
            error: () => {
              ratingsWithMovies.push({ ...rating });
              loaded++;

              if (loaded === ratings.length) {
                this.myRatings.set(ratingsWithMovies);
                this.isLoadingRatings.set(false);
              }
            }
          });
        });
      },
      error: (err) => {
        console.error('Error loading ratings:', err);
        this.isLoadingRatings.set(false);
      }
    });
  }

  startEditRating(movieId: number, currentRating: number): void {
    this.editingRating.set(movieId);
    this.editRatingValue.set(currentRating);
  }

  cancelEditRating(): void {
    this.editingRating.set(null);
  }

  saveRating(movieId: number): void {
    const newRating = this.editRatingValue();

    this.ratingService.createMyRating({ movieId, rating: newRating }).subscribe({
      next: (updated) => {
        const ratings = this.myRatings();
        const index = ratings.findIndex(r => r.movieId === movieId);

        if (index >= 0) {
          ratings[index].rating = updated.rating;
          ratings[index].timestamp = updated.timestamp;
        }

        this.myRatings.set([...ratings]);
        this.editingRating.set(null);
      },
      error: () => {
        alert('Error al actualizar la calificación');
      }
    });
  }

  async deleteRating(movieId: number): Promise<void> {
    const rating = this.myRatings().find(r => r.movieId === movieId);
    const movieTitle = rating?.movie?.title || 'esta película';

    const confirmed = await this.confirmationService.confirm({
      title: 'Eliminar calificación',
      message: `¿Estás seguro de que deseas eliminar tu calificación de "${movieTitle}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      icon: 'delete'
    });

    if (!confirmed) return;

    this.ratingService.deleteRating(movieId).subscribe({
      next: () => {
        const ratings = this.myRatings().filter(r => r.movieId !== movieId);
        this.myRatings.set(ratings);
      },
      error: (err: any) => {
        console.error('Error deleting rating:', err);
        alert('Error al eliminar la calificación');
      }
    });
  }

  onRatingFilterChange(): void {
    this.ratingsPage.set(0);
  }

  previousPage(): void {
    if (this.ratingsPage() > 0) {
      this.ratingsPage.set(this.ratingsPage() - 1);
    }
  }

  nextPage(): void {
    if (this.ratingsPage() < this.totalPages() - 1) {
      this.ratingsPage.set(this.ratingsPage() + 1);
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES');
  }
}
