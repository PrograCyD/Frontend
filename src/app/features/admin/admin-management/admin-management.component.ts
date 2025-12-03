import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { MovieService } from '../../../services/movie.service';
import { MovieRequestService } from '../../../services/movie-request.service';
import {
  Movie,
  CreateMovieRequest,
  UpdateMovieRequest,
  RatingWithDetails,
  CreateRatingByAdminRequest,
  UpdateRatingByAdminRequest,
  DeleteRatingByAdminRequest,
  User,
  MovieRequest
} from '../../../models';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { TEST_USERS } from '../../../data/test-users';

type AdminTab = 'movies' | 'ratings' | 'requests' | 'remap';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {
  // Tab control
  activeTab = signal<AdminTab>('movies');

  // ============================================
  // MOVIES TAB
  // ============================================

  movies = signal<Movie[]>([]);
  moviesTotal = signal(0);
  moviesPage = signal(0);
  moviesPageSize = signal(10);
  moviesFilters = signal({
    search: '',
    genre: '',
    sortBy: 'title' as 'title' | 'year' | 'rating' | 'popularity',
    sortOrder: 'asc' as 'asc' | 'desc'
  });

  showMovieForm = signal(false);
  isEditingMovie = signal(false);
  movieForm = signal<{
    title: string;
    year: number;
    genres: string[];
    movieLensLink?: string;
    imdbLink?: string;
    tmdbLink?: string;
    genomeTags?: string;
    userTags?: string;
    apiLink?: string;
    jsonData?: string;
    tmdbId?: number;
    imdbId?: string;
    movieLensId?: number;
    overview?: string;
    posterPath?: string;
    backdropPath?: string;
    voteAverage?: number;
    voteCount?: number;
    popularity?: number;
    runtime?: number;
    budget?: number;
    revenue?: number;
    releaseDate?: string;
    originalLanguage?: string;
    tagline?: string;
  }>({
    title: '',
    year: new Date().getFullYear(),
    genres: [],
    tmdbId: undefined,
    imdbId: '',
    movieLensId: undefined,
    genomeTags: '',
    userTags: '',
    overview: '',
    posterPath: '',
    backdropPath: '',
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    runtime: 0,
    budget: 0,
    revenue: 0,
    releaseDate: '',
    originalLanguage: 'en',
    tagline: '',
    movieLensLink: '',
    imdbLink: '',
    tmdbLink: '',
    apiLink: '',
    jsonData: ''
  });
  editingMovieId = signal<number | null>(null);

  availableGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War'
  ];

  // ============================================
  // RATINGS TAB
  // ============================================

  ratings = signal<RatingWithDetails[]>([]);
  ratingsTotal = signal(0);
  ratingsPage = signal(0);
  ratingsPageSize = signal(10);
  ratingsFilters = signal({
    userId: undefined as number | undefined,
    movieId: undefined as number | undefined,
    minRating: 0,
    maxRating: 5
  });

  showRatingForm = signal(false);
  isEditingRating = signal(false);
  ratingForm = signal({
    userId: 0,
    movieId: 0,
    rating: 3
  });
  editingRatingKey = signal<string | null>(null); // userId-movieId

  // Convert TEST_USERS to User objects with userId
  availableUsers: User[] = TEST_USERS.map((testUser, index) => ({
    userId: index + 1,
    email: testUser.email,
    role: testUser.role,
    username: testUser.email.split('@')[0],
    firstName: testUser.email.split('@')[0].split('.')[0] || 'User',
    lastName: testUser.email.split('@')[0].split('.')[1] || String(index + 1)
  }));
  availableMovies = computed(() => this.movies());

  // ============================================
  // REQUESTS TAB
  // ============================================

  movieRequests = signal<MovieRequest[]>([]);
  requestsTotal = signal(0);
  requestsFilter = signal<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  showRequestDetails = signal(false);
  selectedRequest = signal<MovieRequest | null>(null);
  reviewNote = signal('');

  pendingRequestsCount = computed(() =>
    this.movieRequests().filter(r => r.status === 'pending').length
  );

  filteredRequests = computed(() => {
    const filter = this.requestsFilter();
    if (filter === 'all') return this.movieRequests();
    return this.movieRequests().filter(r => r.status === filter);
  });

  // Services
  private adminService = inject(AdminService);
  private movieService = inject(MovieService);
  private movieRequestService = inject(MovieRequestService);

  // ============================================
  // REMAP TAB
  // ============================================

  isRemapping = signal(false);
  remapResult = signal<{
    success: boolean;
    message: string;
    affectedMovies?: number;
    affectedRatings?: number;
    duration?: number;
  } | null>(null);

  // ============================================
  // LOADING STATES
  // ============================================

  isLoadingMovies = signal(false);
  isLoadingRatings = signal(false);
  isSubmitting = signal(false);

  // ============================================
  // COMPUTED
  // ============================================

  moviesTotalPages = computed(() =>
    Math.ceil(this.moviesTotal() / this.moviesPageSize())
  );

  ratingsTotalPages = computed(() =>
    Math.ceil(this.ratingsTotal() / this.ratingsPageSize())
  );

  ngOnInit(): void {
    this.loadMovies();
    this.loadRatings();
    this.loadRequests();
  }

  // ============================================
  // TAB NAVIGATION
  // ============================================

  setActiveTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }

  // ============================================
  // MOVIES MANAGEMENT
  // ============================================

  loadMovies(): void {
    this.isLoadingMovies.set(true);
    const filters = this.moviesFilters();
    const page = this.moviesPage();
    const pageSize = this.moviesPageSize();

    this.adminService.getMoviesForManagement({
      limit: pageSize,
      offset: page * pageSize,
      search: filters.search || undefined,
      genre: filters.genre || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    }).subscribe({
      next: (response) => {
        this.movies.set(response.movies);
        this.moviesTotal.set(response.total);
        this.isLoadingMovies.set(false);
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        this.isLoadingMovies.set(false);
      }
    });
  }

  onMoviesFilterChange(): void {
    this.moviesPage.set(0);
    this.loadMovies();
  }

  previousMoviesPage(): void {
    if (this.moviesPage() > 0) {
      this.moviesPage.set(this.moviesPage() - 1);
      this.loadMovies();
    }
  }

  nextMoviesPage(): void {
    if (this.moviesPage() < this.moviesTotalPages() - 1) {
      this.moviesPage.set(this.moviesPage() + 1);
      this.loadMovies();
    }
  }

  openAddMovieForm(): void {
    this.isEditingMovie.set(false);
    this.editingMovieId.set(null);
    this.resetMovieForm();
    this.showMovieForm.set(true);
  }

  openEditMovieForm(movie: Movie): void {
    this.isEditingMovie.set(true);
    this.editingMovieId.set(movie.movieId);

    // Extract genome tags as comma-separated string
    const genomeTagsStr = movie.genomeTags?.map(gt => gt.tag).join(', ') || '';
    const userTagsArray = movie.userTags || [];

    this.movieForm.set({
      title: movie.title,
      year: movie.year || new Date().getFullYear(),
      genres: [...movie.genres],
      tmdbId: movie.externalData?.posterUrl ? undefined : undefined, // TODO: extract from links
      imdbId: movie.links?.imdb || '',
      movieLensId: undefined, // TODO: extract from links
      genomeTags: genomeTagsStr,
      userTags: userTagsArray.join(', '),
      overview: movie.externalData?.overview,
      posterPath: movie.externalData?.posterUrl,
      backdropPath: undefined,
      voteAverage: movie.ratingStats?.average,
      voteCount: movie.ratingStats?.count,
      popularity: undefined,
      runtime: movie.externalData?.runtime,
      budget: movie.externalData?.budget,
      revenue: movie.externalData?.revenue,
      releaseDate: movie.year ? `${movie.year}-01-01` : undefined,
      originalLanguage: undefined,
      tagline: undefined
    });
    this.showMovieForm.set(true);
  }

  resetMovieForm(): void {
    this.movieForm.set({
      title: '',
      year: new Date().getFullYear(),
      genres: [],
      tmdbId: undefined,
      imdbId: '',
      movieLensId: undefined,
      genomeTags: '',
      userTags: '',
      overview: '',
      posterPath: '',
      backdropPath: '',
      voteAverage: 0,
      voteCount: 0,
      popularity: 0,
      runtime: 0,
      budget: 0,
      revenue: 0,
      releaseDate: '',
      originalLanguage: 'en',
      tagline: '',
      movieLensLink: '',
      imdbLink: '',
      tmdbLink: '',
      apiLink: '',
      jsonData: ''
    });
  }

  toggleMovieGenre(genre: string): void {
    const form = this.movieForm();
    const genres = [...(form.genres || [])];
    const index = genres.indexOf(genre);

    if (index >= 0) {
      genres.splice(index, 1);
    } else {
      genres.push(genre);
    }

    this.movieForm.set({ ...form, genres });
  }

  submitMovieForm(): void {
    const form = this.movieForm();

    if (!form.title || !form.genres || form.genres.length === 0) {
      alert('Por favor completa al menos el título y selecciona al menos un género');
      return;
    }

    this.isSubmitting.set(true);

    if (this.isEditingMovie()) {
      // Update movie
      const movieId = this.editingMovieId();
      if (!movieId) return;

      this.adminService.updateMovie({ movieId, ...form } as UpdateMovieRequest).subscribe({
        next: () => {
          alert('Película actualizada exitosamente');
          this.showMovieForm.set(false);
          this.loadMovies();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('Error updating movie:', err);
          alert('Error al actualizar la película');
          this.isSubmitting.set(false);
        }
      });
    } else {
      // Create movie
      this.adminService.createMovie(form as CreateMovieRequest).subscribe({
        next: () => {
          alert('Película creada exitosamente');
          this.showMovieForm.set(false);
          this.loadMovies();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('Error creating movie:', err);
          alert('Error al crear la película');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  deleteMovie(movieId: number, title: string): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${title}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.adminService.deleteMovie(movieId).subscribe({
      next: () => {
        alert('Película eliminada exitosamente');
        this.loadMovies();
      },
      error: (err) => {
        console.error('Error deleting movie:', err);
        alert('Error al eliminar la película');
      }
    });
  }

  // ============================================
  // RATINGS MANAGEMENT
  // ============================================

  loadRatings(): void {
    this.isLoadingRatings.set(true);
    const filters = this.ratingsFilters();
    const page = this.ratingsPage();
    const pageSize = this.ratingsPageSize();

    this.adminService.getAllRatings({
      limit: pageSize,
      offset: page * pageSize,
      userId: filters.userId,
      movieId: filters.movieId,
      minRating: filters.minRating,
      maxRating: filters.maxRating
    }).subscribe({
      next: (response) => {
        this.ratings.set(response.ratings);
        this.ratingsTotal.set(response.total);
        this.isLoadingRatings.set(false);
      },
      error: (err) => {
        console.error('Error loading ratings:', err);
        this.isLoadingRatings.set(false);
      }
    });
  }

  onRatingsFilterChange(): void {
    this.ratingsPage.set(0);
    this.loadRatings();
  }

  previousRatingsPage(): void {
    if (this.ratingsPage() > 0) {
      this.ratingsPage.set(this.ratingsPage() - 1);
      this.loadRatings();
    }
  }

  nextRatingsPage(): void {
    if (this.ratingsPage() < this.ratingsTotalPages() - 1) {
      this.ratingsPage.set(this.ratingsPage() + 1);
      this.loadRatings();
    }
  }

  openAddRatingForm(): void {
    this.isEditingRating.set(false);
    this.editingRatingKey.set(null);
    this.ratingForm.set({
      userId: this.availableUsers[0]?.userId || 0,
      movieId: this.availableMovies()[0]?.movieId || 0,
      rating: 3
    });
    this.showRatingForm.set(true);
  }

  openEditRatingForm(rating: RatingWithDetails): void {
    this.isEditingRating.set(true);
    this.editingRatingKey.set(`${rating.userId}-${rating.movieId}`);
    this.ratingForm.set({
      userId: rating.userId,
      movieId: rating.movieId,
      rating: rating.rating
    });
    this.showRatingForm.set(true);
  }

  submitRatingForm(): void {
    const form = this.ratingForm();

    if (!form.userId || !form.movieId) {
      alert('Por favor selecciona un usuario y una película');
      return;
    }

    if (form.rating < 0.5 || form.rating > 5) {
      alert('La calificación debe estar entre 0.5 y 5');
      return;
    }

    this.isSubmitting.set(true);

    if (this.isEditingRating()) {
      // Update rating
      const request: UpdateRatingByAdminRequest = {
        userId: form.userId,
        movieId: form.movieId,
        rating: form.rating
      };

      this.adminService.updateRatingByAdmin(request).subscribe({
        next: () => {
          alert('Calificación actualizada exitosamente');
          this.showRatingForm.set(false);
          this.loadRatings();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('Error updating rating:', err);
          alert('Error al actualizar la calificación');
          this.isSubmitting.set(false);
        }
      });
    } else {
      // Create rating
      const request: CreateRatingByAdminRequest = {
        userId: form.userId,
        movieId: form.movieId,
        rating: form.rating
      };

      this.adminService.createRatingByAdmin(request).subscribe({
        next: () => {
          alert('Calificación creada exitosamente');
          this.showRatingForm.set(false);
          this.loadRatings();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('Error creating rating:', err);
          alert('Error al crear la calificación');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  deleteRating(userId: number, movieId: number, userName: string, movieTitle: string): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar la calificación de ${userName} para "${movieTitle}"?`)) {
      return;
    }

    const request: DeleteRatingByAdminRequest = {
      userId,
      movieId
    };

    this.adminService.deleteRatingByAdmin(request).subscribe({
      next: () => {
        alert('Calificación eliminada exitosamente');
        this.loadRatings();
      },
      error: (err) => {
        console.error('Error deleting rating:', err);
        alert('Error al eliminar la calificación');
      }
    });
  }

  // ============================================
  // REQUESTS MANAGEMENT
  // ============================================

  loadRequests(): void {
    this.movieRequestService.getAllMovieRequests().subscribe({
      next: (response) => {
        this.movieRequests.set(response.requests);
        this.requestsTotal.set(response.total);
      },
      error: (err) => {
        console.error('Error loading requests:', err);
        alert('Error al cargar las solicitudes');
      }
    });
  }

  setRequestsFilter(filter: 'all' | 'pending' | 'approved' | 'rejected'): void {
    this.requestsFilter.set(filter);
  }

  viewRequestDetails(request: MovieRequest): void {
    this.selectedRequest.set(request);
    this.reviewNote.set(request.reviewNote || '');
    this.showRequestDetails.set(true);
  }

  closeRequestDetails(): void {
    this.showRequestDetails.set(false);
    this.selectedRequest.set(null);
    this.reviewNote.set('');
  }

  approveRequest(request: MovieRequest): void {
    if (!confirm(`¿Aprobar la solicitud de ${request.requestType === 'add' ? 'agregar' : 'editar'} "${request.movieData.title}"?`)) {
      return;
    }

    if (!request.requestId) {
      alert('Error: ID de solicitud no válido');
      return;
    }

    const note = this.reviewNote() || 'Solicitud aprobada';

    this.movieRequestService.approveMovieRequest(request.requestId, note).subscribe({
      next: () => {
        alert('Solicitud aprobada exitosamente');
        this.loadRequests();
        this.closeRequestDetails();
      },
      error: (err) => {
        console.error('Error approving request:', err);
        alert('Error al aprobar la solicitud');
      }
    });
  }

  rejectRequest(request: MovieRequest): void {
    const note = prompt('Motivo del rechazo (opcional):');
    if (note === null) return; // User cancelled

    if (!request.requestId) {
      alert('Error: ID de solicitud no válido');
      return;
    }

    this.movieRequestService.rejectMovieRequest(request.requestId, note || 'Solicitud rechazada').subscribe({
      next: () => {
        alert('Solicitud rechazada');
        this.loadRequests();
        this.closeRequestDetails();
      },
      error: (err) => {
        console.error('Error rejecting request:', err);
        alert('Error al rechazar la solicitud');
      }
    });
  }

  // ============================================
  // REMAP DATABASE
  // ============================================

  confirmRemap(): void {
    if (!confirm('¿Estás seguro de que deseas remapear la base de datos? Este proceso puede tardar varios minutos y afectará todas las películas y calificaciones.')) {
      return;
    }

    this.isRemapping.set(true);
    this.remapResult.set(null);

    this.adminService.remapDatabase().subscribe({
      next: (result) => {
        this.remapResult.set(result);
        this.isRemapping.set(false);
      },
      error: (err) => {
        console.error('Error remapping database:', err);
        this.remapResult.set({
          success: false,
          message: 'Error al remapear la base de datos'
        });
        this.isRemapping.set(false);
      }
    });
  }

  // ============================================
  // UTILITIES
  // ============================================

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES');
  }

  getUserName(userId: number): string {
    const user = this.availableUsers.find(u => u.userId === userId);
    return user ? `${user.firstName} ${user.lastName}` : `User ${userId}`;
  }

  getMovieTitle(movieId: number): string {
    const movie = this.availableMovies().find(m => m.movieId === movieId);
    return movie?.title || `Movie ${movieId}`;
  }
}
