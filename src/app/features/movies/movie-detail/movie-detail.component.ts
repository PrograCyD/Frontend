import {
  Component,
  OnInit,
  signal,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieExtended } from '../../../models/movie.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { ConfirmationService } from '../../../services/confirmation.service';
import { mockMovies } from '../../../data/mock-movies';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, MovieCardComponent],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('similarCarousel') similarCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('similarPrev') similarPrev!: ElementRef<HTMLButtonElement>;
  @ViewChild('similarNext') similarNext!: ElementRef<HTMLButtonElement>;

  movie = signal<MovieExtended | null>(null);
  userRating = signal(0);
  isLoading = signal(false);

  // Películas similares usando géneros + genomeTags + userTags
  similarMovies = computed(() => {
    const currentMovie = this.movie();
    if (!currentMovie) return [];

    const currentGenomeTags =
      (currentMovie.genomeTags || []).map(t =>
        typeof t === 'string' ? t : t.tag
      );
    const currentUserTags = currentMovie.userTags || [];

    return mockMovies
      .filter(m => m.movieId !== currentMovie.movieId)
      .map(m => {
        let score = 0;

        // Géneros compartidos (más peso)
        const sharedGenres = m.genres.filter(g =>
          currentMovie.genres.includes(g)
        );
        score += sharedGenres.length * 3;

        // Genome tags compartidos
        const mGenomeTags = (m.genomeTags || []).map(t =>
          typeof t === 'string' ? t : t.tag
        );
        const sharedGenomeTags = mGenomeTags.filter(tag =>
          currentGenomeTags.includes(tag)
        );
        score += sharedGenomeTags.length * 2;

        // User tags compartidos
        const mUserTags = m.userTags || [];
        const sharedUserTags = mUserTags.filter(tag =>
          currentUserTags.includes(tag)
        );
        score += sharedUserTags.length;

        return { movie: m, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.movie);
  });

  private confirmationService = inject(ConfirmationService);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (!movieId) {
      this.router.navigate(['/movies']);
      return;
    }

    this.loadMovie(parseInt(movieId, 10));
  }

  ngAfterViewInit(): void {
    // Configurar listeners de scroll para actualizar botones
    setTimeout(() => {
      this.updateCarouselButtons();

      if (this.similarCarousel?.nativeElement) {
        this.similarCarousel.nativeElement.addEventListener('scroll', () => {
          this.updateCarouselButtons();
        });
      }
    }, 100);
  }

  loadMovie(id: number): void {
    this.isLoading.set(true);

    // TODO: reemplazar mockMovies por llamada al backend /movies/{id}
    setTimeout(() => {
      const movie = mockMovies.find(m => m.movieId === id);
      if (movie) {
        this.movie.set(movie);
      } else {
        this.router.navigate(['/movies']);
      }
      this.isLoading.set(false);
    }, 300);
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }

  async onRatingChange(rating: number): Promise<void> {
    const movie = this.movie();
    if (!movie) return;

    const confirmed = await this.confirmationService.confirm({
      title: 'Confirmar calificación',
      message: `¿Deseas calificar "${movie.title}" con ${rating} estrella${rating !== 1 ? 's' : ''}?`,
      confirmText: 'Calificar',
      cancelText: 'Cancelar',
      type: 'info',
      icon: 'star'
    });

    if (confirmed) {
      this.userRating.set(rating);
      // TODO: guardar rating en backend
      console.log('Rating changed:', rating);
    }
  }

  onSimilarMovieClick(movie: MovieExtended): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/movies', movie.movieId]);
  }

  // Ahora, como el endpoint de búsqueda no tiene filtro por actor,
  // solo enviamos el nombre del actor en q (búsqueda de texto libre).
  onActorClick(actor: string): void {
    this.router.navigate(['/movies'], {
      queryParams: { q: actor }
    });
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getYear(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear().toString();
  }

  scrollSimilarMovies(direction: 'left' | 'right'): void {
    const carouselElement = this.similarCarousel?.nativeElement;
    if (!carouselElement) return;

    const scrollAmount = carouselElement.clientWidth * 0.8;
    const targetScroll =
      direction === 'left'
        ? carouselElement.scrollLeft - scrollAmount
        : carouselElement.scrollLeft + scrollAmount;

    carouselElement.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }

  updateCarouselButtons(): void {
    const carouselElement = this.similarCarousel?.nativeElement;
    const prevButton = this.similarPrev?.nativeElement;
    const nextButton = this.similarNext?.nativeElement;

    if (!carouselElement || !prevButton || !nextButton) return;

    const scrollLeft = carouselElement.scrollLeft;
    const scrollWidth = carouselElement.scrollWidth;
    const clientWidth = carouselElement.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    const hasOverflow = scrollWidth > clientWidth;

    if (!hasOverflow) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    } else {
      prevButton.style.display = scrollLeft <= 5 ? 'none' : 'flex';
      nextButton.style.display = scrollLeft >= maxScroll - 5 ? 'none' : 'flex';
    }
  }
}
