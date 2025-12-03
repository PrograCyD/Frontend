import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieRequestService } from '../../../services/movie-request.service';
import { RatingService } from '../../../services/rating.service';
import { MovieService } from '../../../services/movie.service';
import { MovieRequest, CreateMovieRequestParams, Movie, Rating } from '../../../models';
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
  requestForm = signal({
    requestType: 'add' as 'add' | 'edit',
    movieId: undefined as number | undefined,
    title: '',
    year: new Date().getFullYear(),
    genres: [] as string[],
    movieLensLink: '',
    imdbLink: '',
    tmdbLink: '',
    genomeTags: '',
    userTags: '',
    apiLink: '',
    jsonData: ''
  });

  // Ratings tab
  myRatings = signal<UserRatingExtended[]>([]);
  ratingsPage = signal(0);
  ratingsPageSize = signal(10);
  ratingsTotal = signal(0);
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

  // Computed
  paginatedRatings = computed(() => {
    const ratings = this.myRatings();
    const filter = this.ratingsFilter();

    // Apply filters
    let filtered = ratings.filter(r => {
      const matchesSearch = !filter.search ||
        r.movie?.title.toLowerCase().includes(filter.search.toLowerCase());
      const matchesMinRating = r.rating >= filter.minRating;
      const matchesMaxRating = r.rating <= filter.maxRating;
      return matchesSearch && matchesMinRating && matchesMaxRating;
    });

    this.ratingsTotal.set(filtered.length);

    // Paginate
    const page = this.ratingsPage();
    const pageSize = this.ratingsPageSize();
    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  });

  totalPages = computed(() =>
    Math.ceil(this.ratingsTotal() / this.ratingsPageSize())
  );

  // Services
  private movieRequestService = inject(MovieRequestService);
  private ratingService = inject(RatingService);
  private movieService = inject(MovieService);

  ngOnInit(): void {
    this.loadMyRequests();
    this.loadMyRatings();
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
    this.movieRequestService.getMyMovieRequests().subscribe({
      next: (response: any) => {
        this.myRequests.set(response.requests);
        this.isLoadingRequests.set(false);
      },
      error: (err: any) => {
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
      apiLink: '',
      jsonData: ''
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

  submitMovieRequest(): void {
    const form = this.requestForm();

    if (!form.title || form.genres.length === 0) {
      alert('Por favor completa al menos el título y selecciona al menos un género');
      return;
    }

    this.isSubmitting.set(true);

    const params: CreateMovieRequestParams = {
      requestType: form.requestType,
      movieId: form.movieId,
      movieData: {
        title: form.title,
        year: form.year,
        genres: form.genres,
        links: {
          movieLens: form.movieLensLink || undefined,
          imdb: form.imdbLink || undefined,
          tmdb: form.tmdbLink || undefined
        },
        genomeTags: form.genomeTags ? form.genomeTags.split(',').map(t => t.trim()) : undefined,
        userTags: form.userTags ? form.userTags.split(',').map(t => t.trim()) : undefined,
        apiLink: form.apiLink || undefined,
        jsonData: form.jsonData || undefined
      }
    };

    this.movieRequestService.createMovieRequest(params).subscribe({
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
      next: (response: any) => {
        // Load movie details for each rating
        const ratingsWithMovies: UserRatingExtended[] = [];
        let loaded = 0;

        if (response.ratings.length === 0) {
          this.myRatings.set([]);
          this.isLoadingRatings.set(false);
          return;
        }

        response.ratings.forEach((rating: any) => {
          this.movieService.getMovie(rating.movieId).subscribe({
            next: (movie: Movie) => {
              ratingsWithMovies.push({ ...rating, movie });
              loaded++;
              if (loaded === response.ratings.length) {
                this.myRatings.set(ratingsWithMovies);
                this.isLoadingRatings.set(false);
              }
            },
            error: () => {
              ratingsWithMovies.push(rating);
              loaded++;
              if (loaded === response.ratings.length) {
                this.myRatings.set(ratingsWithMovies);
                this.isLoadingRatings.set(false);
              }
            }
          });
        });
      },
      error: (err: any) => {
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
      next: () => {
        // Update local state
        const ratings = this.myRatings();
        const index = ratings.findIndex(r => r.movieId === movieId);
        if (index >= 0) {
          ratings[index].rating = newRating;
          ratings[index].timestamp = Math.floor(Date.now() / 1000);
          this.myRatings.set([...ratings]);
        }
        this.editingRating.set(null);
      },
      error: (err: any) => {
        console.error('Error updating rating:', err);
        alert('Error al actualizar la calificación');
      }
    });
  }

  deleteRating(movieId: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar esta calificación?')) {
      return;
    }

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
