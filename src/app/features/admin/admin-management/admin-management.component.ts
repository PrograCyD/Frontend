import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { MovieService } from '../../../services/movie.service';
import { MovieRequestService } from '../../../services/movie-request.service';
import { ConfirmationService } from '../../../services/confirmation.service';
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

type AdminTab = 'movies' | 'ratings' | 'requests' | 'remap' | 'similarities';

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
  formInputMode = signal<'manual' | 'url'>('manual'); // Modo del formulario
  genreDropdownOpen = signal(false); // Controla si el dropdown de géneros está abierto
  isLoadingFromUrl = signal(false);
  urlImportError = signal<string | null>(null);
  urlImportSuccess = signal(false);
  movieForm = signal<{
    movieId?: number;
    iIdx?: number;
    title: string;
    year: number;
    genres: string[];
    links?: {
      movielens?: string;
      imdb?: string;
      tmdb?: string;
    };
    genomeTags?: Array<{tag: string; relevance: number}>;
    userTags?: string[];
    ratingStats?: {
      average?: number;
      count?: number;
      lastRatedAt?: string;
    };
    externalData?: {
      posterUrl?: string;
      overview?: string;
      cast?: Array<{name: string; profileUrl?: string}>;
      director?: string;
      runtime?: number;
      budget?: number;
      revenue?: number;
      tmdbFetched?: boolean;
    };
    // Campos auxiliares para entrada manual
    movieLensLink?: string;
    imdbLink?: string;
    tmdbLink?: string;
    genomeTagsInput?: string; // Para entrada manual de tags separados por comas
    userTagsInput?: string;
    castInput?: string; // nombres separados por comas
    castUrlsInput?: string; // URLs de fotos del cast separadas por comas
    posterUrl?: string;
    overview?: string;
    director?: string;
    runtime?: number;
    budget?: number;
    revenue?: number;
    // Campo para JSON completo
    importUrl?: string; // URL para importar datos
    jsonData?: string;
  }>({
    title: '',
    year: new Date().getFullYear(),
    genres: [],
    links: {},
    genomeTags: [],
    userTags: [],
    ratingStats: {},
    externalData: {},
    genomeTagsInput: '',
    userTagsInput: '',
    castInput: '',
    castUrlsInput: '',
    posterUrl: '',
    overview: '',
    director: '',
    runtime: undefined,
    budget: undefined,
    revenue: undefined,
    movieLensLink: '',
    imdbLink: '',
    tmdbLink: '',
    importUrl: '',
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
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

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
  // SIMILARITIES TAB
  // ============================================

  similaritiesStatus = signal<{
    totalMovies: number;
    moviesWithSimilarities: number;
    moviesPending: number;
    lastCalculated: string | null;
  }>({
    totalMovies: 0,
    moviesWithSimilarities: 0,
    moviesPending: 0,
    lastCalculated: null
  });

  pendingMovies = signal<Movie[]>([]);
  isLoadingSimilarities = signal(false);
  isCalculatingSimilarities = signal(false);
  similaritiesResult = signal<{
    success: boolean;
    message: string;
    processedMovies?: number;
    duration?: number;
  } | null>(null);

  pendingSimilaritiesCount = computed(() => this.similaritiesStatus().moviesPending);

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
    // Cerrar modal de solicitud si está abierto
    if (this.showRequestDetails()) {
      this.showRequestDetails.set(false);
      this.selectedRequest.set(null);
    }

    // Cargar datos específicos de la tab
    if (tab === 'similarities') {
      this.loadSimilaritiesStatus();
      this.loadPendingMovies();
    }
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
    this.formInputMode.set('manual');
    this.resetMovieForm();
    this.showMovieForm.set(true);
  }

  openEditMovieForm(movie: Movie): void {
    this.isEditingMovie.set(true);
    this.editingMovieId.set(movie.movieId);
    this.formInputMode.set('manual'); // Abrir en modo manual por defecto

    // Extraer datos para campos manuales
    const genomeTagsStr = movie.genomeTags?.map(gt => gt.tag).join(', ') || '';
    const userTagsStr = movie.userTags?.join(', ') || '';
    const castStr = movie.externalData?.cast?.map(c => c.name).join(', ') || '';
    const castUrlsStr = movie.externalData?.cast?.map(c => c.profileUrl || '').join(', ') || '';

    this.movieForm.set({
      movieId: movie.movieId,
      title: movie.title,
      year: movie.year || new Date().getFullYear(),
      genres: [...movie.genres],
      links: movie.links || {},
      genomeTags: movie.genomeTags || [],
      userTags: movie.userTags || [],
      ratingStats: movie.ratingStats || {},
      externalData: movie.externalData || {},
      // Campos para entrada manual
      genomeTagsInput: genomeTagsStr,
      userTagsInput: userTagsStr,
      castInput: castStr,
      castUrlsInput: castUrlsStr,
      posterUrl: movie.externalData?.posterUrl || '',
      overview: movie.externalData?.overview || '',
      director: movie.externalData?.director || '',
      runtime: movie.externalData?.runtime,
      budget: movie.externalData?.budget,
      revenue: movie.externalData?.revenue,
      movieLensLink: movie.links?.movielens || '',
      imdbLink: movie.links?.imdb || '',
      tmdbLink: movie.links?.tmdb || '',
      // También preparar JSON por si quieren cambiar a ese modo
      jsonData: JSON.stringify(movie, null, 2)
    });

    this.showMovieForm.set(true);
  }

  resetMovieForm(): void {
    this.movieForm.set({
      title: '',
      year: new Date().getFullYear(),
      genres: [],
      links: {},
      genomeTags: [],
      userTags: [],
      ratingStats: {},
      externalData: {},
      genomeTagsInput: '',
      userTagsInput: '',
      castInput: '',
      castUrlsInput: '',
      posterUrl: '',
      overview: '',
      director: '',
      runtime: undefined,
      budget: undefined,
      revenue: undefined,
      movieLensLink: '',
      imdbLink: '',
      tmdbLink: '',
      importUrl: '',
      jsonData: ''
    });
    this.urlImportError.set(null);
    this.urlImportSuccess.set(false);
  }

  importFromUrl(): void {
    const url = this.movieForm().importUrl?.trim();
    if (!url) return;

    this.isLoadingFromUrl.set(true);
    this.urlImportError.set(null);
    this.urlImportSuccess.set(false);

    // Llamar al servicio de admin para obtener los datos desde la URL
    this.adminService.fetchMovieFromUrl(url).subscribe({
      next: (movieData) => {
        // Rellenar el formulario con los datos obtenidos
        this.movieForm.update(form => ({
          ...form,
          title: movieData.title || '',
          year: movieData.year || new Date().getFullYear(),
          genres: movieData.genres || [],
          overview: movieData.externalData?.overview || '',
          posterUrl: movieData.externalData?.posterUrl || '',
          director: movieData.externalData?.director || '',
          runtime: movieData.externalData?.runtime,
          budget: movieData.externalData?.budget,
          revenue: movieData.externalData?.revenue,
          castInput: movieData.externalData?.cast?.map(c => c.name).join(', ') || '',
          imdbLink: movieData.links?.imdb || '',
          tmdbLink: movieData.links?.tmdb || '',
          movieLensLink: movieData.links?.movielens || ''
        }));

        this.isLoadingFromUrl.set(false);
        this.urlImportSuccess.set(true);
      },
      error: (err) => {
        console.error('Error importing from URL:', err);
        this.isLoadingFromUrl.set(false);
        this.urlImportError.set(
          err.error?.message ||
          'No se pudieron obtener los datos de la URL. Verifica que sea una URL válida de TMDb, IMDb o MovieLens.'
        );
      }
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

  toggleGenreDropdown(): void {
    this.genreDropdownOpen.set(!this.genreDropdownOpen());
  }

  closeGenreDropdown(): void {
    this.genreDropdownOpen.set(false);
  }

  getSelectedGenresText(): string {
    const genres = this.movieForm().genres;
    if (!genres || genres.length === 0) {
      return 'Seleccionar géneros...';
    }
    return `${genres.length} género${genres.length !== 1 ? 's' : ''} seleccionado${genres.length !== 1 ? 's' : ''}`;
  }

  async submitMovieForm(): Promise<void> {
    const form = this.movieForm();
    const mode = this.formInputMode();

    let movieData: any;

    // Procesar según el modo de entrada
    if (mode === 'url') {
      // Modo URL: los datos ya están cargados en el formulario
      if (!form.title || !form.genres || form.genres.length === 0) {
        alert('Por favor completa al menos el título y selecciona al menos un género');
        return;
      }

      // Construir objeto movie con la estructura completa
      movieData = {
        title: form.title,
        year: form.year,
        genres: form.genres,
        links: {
          movielens: form.movieLensLink || undefined,
          imdb: form.imdbLink || undefined,
          tmdb: form.tmdbLink || undefined
        },
        externalData: {
          posterUrl: form.posterUrl || undefined,
          overview: form.overview || undefined,
          director: form.director || undefined,
          runtime: form.runtime || undefined,
          budget: form.budget || undefined,
          revenue: form.revenue || undefined,
          cast: form.castInput ? form.castInput.split(',').map(name => ({ name: name.trim() })) : undefined
        }
      };
    } else {
      // Modo Manual: construir el objeto desde los campos del formulario
      if (!form.title || !form.genres || form.genres.length === 0) {
        alert('Por favor completa al menos el título y selecciona al menos un género');
        return;
      }

      // Construir objeto movie con la estructura completa
      movieData = {
        title: form.title,
        year: form.year,
        genres: form.genres,
        links: {
          movielens: form.movieLensLink || undefined,
          imdb: form.imdbLink || undefined,
          tmdb: form.tmdbLink || undefined
        },
        genomeTags: form.genomeTagsInput
          ? form.genomeTagsInput.split(',').map(tag => ({
              tag: tag.trim(),
              relevance: 0.5 // Relevancia por defecto
            }))
          : [],
        userTags: form.userTagsInput
          ? form.userTagsInput.split(',').map(tag => tag.trim())
          : [],
        externalData: {
          posterUrl: form.posterUrl || undefined,
          overview: form.overview || undefined,
          director: form.director || undefined,
          runtime: form.runtime || undefined,
          budget: form.budget || undefined,
          revenue: form.revenue || undefined,
          cast: (() => {
            if (!form.castInput) return [];
            const names = form.castInput.split(',').map(n => n.trim());
            const urls = form.castUrlsInput ? form.castUrlsInput.split(',').map(u => u.trim()) : [];
            return names.map((name, index) => ({
              name,
              profileUrl: urls[index] || undefined
            }));
          })()
        }
      };
    }

    const isEdit = this.isEditingMovie();
    const confirmed = await this.confirmationService.confirm({
      title: isEdit ? 'Confirmar edición' : 'Confirmar creación',
      message: isEdit
        ? `¿Deseas actualizar la película "${movieData.title}"?`
        : `¿Deseas crear la película "${movieData.title}"?`,
      confirmText: isEdit ? 'Actualizar' : 'Crear',
      type: 'info',
      icon: isEdit ? 'edit' : 'add_circle'
    });

    if (!confirmed) return;

    this.isSubmitting.set(true);

    if (isEdit) {
      // Update movie
      const movieId = this.editingMovieId();
      if (!movieId) return;

      this.adminService.updateMovie({ movieId, ...movieData } as UpdateMovieRequest).subscribe({
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
      this.adminService.createMovie(movieData as CreateMovieRequest).subscribe({
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

  viewMovie(movieId: number): void {
    this.router.navigate(['/movies', movieId]);
  }

  async deleteMovie(movieId: number, title: string): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Eliminar película',
      message: `¿Estás seguro de que deseas eliminar "${title}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      icon: 'delete_forever'
    });

    if (!confirmed) return;

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

  async deleteRating(userId: number, movieId: number, userName: string, movieTitle: string): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Eliminar calificación',
      message: `¿Estás seguro de que deseas eliminar la calificación de ${userName} para "${movieTitle}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      icon: 'delete'
    });

    if (!confirmed) return;

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
        // response = { requests: MovieRequest[] }
        this.movieRequests.set(response.requests);
        this.requestsTotal.set(response.requests.length); // ← aquí el cambio
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

  async approveRequest(request: MovieRequest): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Aprobar solicitud',
      message: `¿Aprobar la solicitud de ${request.requestType === 'add' ? 'agregar' : 'editar'} "${request.movieData.title}"?`,
      confirmText: 'Aprobar',
      cancelText: 'Cancelar',
      type: 'success',
      icon: 'check_circle'
    });

    if (!confirmed) return;

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

  async rejectRequest(request: MovieRequest): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Rechazar solicitud',
      message: `¿Estás seguro de que deseas rechazar la solicitud de ${request.requestType === 'add' ? 'agregar' : 'editar'} "${request.movieData.title}"?`,
      confirmText: 'Rechazar',
      cancelText: 'Cancelar',
      type: 'danger',
      icon: 'cancel'
    });

    if (!confirmed) return;

    if (!request.requestId) {
      alert('Error: ID de solicitud no válido');
      return;
    }

    const note = this.reviewNote() || 'Solicitud rechazada';

    this.movieRequestService.rejectMovieRequest(request.requestId, note).subscribe({
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

  async confirmRemap(): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Remapear base de datos',
      message: '¿Estás seguro de que deseas remapear la base de datos? Este proceso puede tardar varios minutos y afectará todas las películas y calificaciones.',
      confirmText: 'Remapear',
      cancelText: 'Cancelar',
      type: 'warning',
      icon: 'warning'
    });

    if (!confirmed) return;

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
  // SIMILARITIES TAB METHODS
  // ============================================

  loadSimilaritiesStatus(): void {
    this.isLoadingSimilarities.set(true);

    // Simular llamada al backend
    setTimeout(() => {
      const totalMovies = 100;
      const moviesWithSimilarities = 75;
      const moviesPending = totalMovies - moviesWithSimilarities;

      this.similaritiesStatus.set({
        totalMovies,
        moviesWithSimilarities,
        moviesPending,
        lastCalculated: new Date(Date.now() - 86400000).toISOString() // 1 día atrás
      });

      this.isLoadingSimilarities.set(false);
    }, 500);
  }

  loadPendingMovies(): void {
    this.isLoadingSimilarities.set(true);

    // Simular carga de películas pendientes
    setTimeout(() => {
      // Aquí se debería llamar al backend para obtener películas sin similitudes
      const mockPendingMovies = this.movies().slice(0, this.similaritiesStatus().moviesPending);
      this.pendingMovies.set(mockPendingMovies);
      this.isLoadingSimilarities.set(false);
    }, 500);
  }

  async confirmCalculateSimilarities(): Promise<void> {
    const pendingCount = this.similaritiesStatus().moviesPending;

    const confirmed = await this.confirmationService.confirm({
      title: 'Calcular similitudes',
      message: `¿Deseas calcular las similitudes para ${pendingCount} película${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}? Este proceso puede tardar algunos minutos.`,
      confirmText: 'Calcular',
      cancelText: 'Cancelar',
      type: 'info',
      icon: 'hub'
    });

    if (!confirmed) return;

    this.isCalculatingSimilarities.set(true);
    this.similaritiesResult.set(null);

    // Simular llamada al backend
    setTimeout(() => {
      const result = {
        success: true,
        message: 'Similitudes calculadas exitosamente',
        processedMovies: pendingCount,
        duration: 3500
      };

      this.similaritiesResult.set(result);
      this.isCalculatingSimilarities.set(false);

      // Actualizar estado
      this.similaritiesStatus.update(status => ({
        ...status,
        moviesWithSimilarities: status.totalMovies,
        moviesPending: 0,
        lastCalculated: new Date().toISOString()
      }));

      this.pendingMovies.set([]);
    }, 3500);
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
