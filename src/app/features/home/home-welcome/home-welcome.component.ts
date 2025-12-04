import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MovieExtended } from '../../../models/movie.model';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { TopMovieCardComponent } from '../../../shared/components/top-movie-card/top-movie-card.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { ConfirmationService } from '../../../services/confirmation.service';
import {
  mockMovies,
  getFeaturedMovie,
  getTopRatedMovies,
  getMoviesByGenre,
  getTrendingMovies,
  getRecentMovies
} from '../../../data/mock-movies';

@Component({
  selector: 'app-home-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent, TopMovieCardComponent, StarRatingComponent],
  templateUrl: './home-welcome.component.html',
  styleUrl: './home-welcome.component.css'
})
export class HomeWelcomeComponent implements OnInit, AfterViewInit {
  @ViewChild('topCarousel') topCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('topPrev') topPrev!: ElementRef<HTMLButtonElement>;
  @ViewChild('topNext') topNext!: ElementRef<HTMLButtonElement>;
  @ViewChild('popularCarousel') popularCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('popularPrev') popularPrev!: ElementRef<HTMLButtonElement>;
  @ViewChild('popularNext') popularNext!: ElementRef<HTMLButtonElement>;
  @ViewChild('recommendedCarousel') recommendedCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('genreCarousel') genreCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('likedCarousel') likedCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('recommendedPrev') recommendedPrev!: ElementRef<HTMLButtonElement>;
  @ViewChild('recommendedNext') recommendedNext!: ElementRef<HTMLButtonElement>;
  @ViewChild('genrePrev') genrePrev!: ElementRef<HTMLButtonElement>;
  @ViewChild('genreNext') genreNext!: ElementRef<HTMLButtonElement>;
  @ViewChild('likedPrev') likedPrev!: ElementRef<HTMLButtonElement>;
  @ViewChild('likedNext') likedNext!: ElementRef<HTMLButtonElement>;

  featuredMovie = signal<MovieExtended | null>(null);
  topMovies = signal<MovieExtended[]>([]);
  popularMovies = signal<MovieExtended[]>([]);
  recommendedMovies = signal<MovieExtended[]>([]);
  genreRecommendations = signal<MovieExtended[]>([]);
  becauseYouLikedMovies = signal<MovieExtended[]>([]);

  // Estado para el rating del hero
  heroRating = signal<number>(0);

  private confirmationService = inject(ConfirmationService);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  ngAfterViewInit(): void {
    // Configurar listeners de scroll para actualizar botones
    setTimeout(() => {
      this.updateCarouselButtons('top');
      this.updateCarouselButtons('popular');
      this.updateCarouselButtons('recommended');
      this.updateCarouselButtons('genre');
      this.updateCarouselButtons('liked');

      // Agregar listeners de scroll
      if (this.topCarousel?.nativeElement) {
        this.topCarousel.nativeElement.addEventListener('scroll', () => {
          this.updateCarouselButtons('top');
        });
      }
      if (this.popularCarousel?.nativeElement) {
        this.popularCarousel.nativeElement.addEventListener('scroll', () => {
          this.updateCarouselButtons('popular');
        });
      }
      if (this.recommendedCarousel?.nativeElement) {
        this.recommendedCarousel.nativeElement.addEventListener('scroll', () => {
          this.updateCarouselButtons('recommended');
        });
      }
      if (this.genreCarousel?.nativeElement) {
        this.genreCarousel.nativeElement.addEventListener('scroll', () => {
          this.updateCarouselButtons('genre');
        });
      }
      if (this.likedCarousel?.nativeElement) {
        this.likedCarousel.nativeElement.addEventListener('scroll', () => {
          this.updateCarouselButtons('liked');
        });
      }
    }, 100);
  }

  loadMovies(): void {
    this.featuredMovie.set(getFeaturedMovie());
    this.topMovies.set(getTopRatedMovies(10));
    // Películas más populares basadas en número de ratings
    const moviesByPopularity = [...mockMovies].sort((a, b) => {
      const countA = a.ratingStats?.count || 0;
      const countB = b.ratingStats?.count || 0;
      return countB - countA;
    });
    this.popularMovies.set(moviesByPopularity.slice(0, 10));
    this.recommendedMovies.set(getTrendingMovies(8));
    this.genreRecommendations.set(getMoviesByGenre('Acción', 8));
    this.becauseYouLikedMovies.set(mockMovies.slice(0, 8));
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  onMovieClick(movie: MovieExtended): void {
    this.router.navigate(['/movies', movie.movieId]);
  }

  viewFeaturedMovieDetails(): void {
    const featured = this.featuredMovie();
    if (featured) {
      this.router.navigate(['/movies', featured.movieId]);
    }
  }

  async onHeroRatingChange(rating: number): Promise<void> {
    const featured = this.featuredMovie();
    if (!featured) return;

    const confirmed = await this.confirmationService.confirm({
      title: 'Confirmar calificación',
      message: `¿Deseas calificar "${featured.title}" con ${rating} estrella${rating !== 1 ? 's' : ''}?`,
      confirmText: 'Calificar',
      cancelText: 'Cancelar',
      type: 'info',
      icon: 'star'
    });

    if (confirmed) {
      this.heroRating.set(rating);
      console.log('Rating del Hero:', rating);
      // Aquí se enviaría la calificación al backend
    }
  }

  onTopMovieRatingChange(event: {movie: MovieExtended, rating: number}): void {
    console.log(`Rating para ${event.movie.title}:`, event.rating);
    // Aquí se enviaría la calificación al backend
    // Por ahora solo mostramos en consola
  }

  onPopularMovieRatingChange(event: {movie: MovieExtended, rating: number}): void {
    console.log(`Rating para película popular ${event.movie.title}:`, event.rating);
    // Aquí se enviaría la calificación al backend
  }

  onMovieRatingChange(event: {movie: MovieExtended, rating: number}): void {
    console.log(`Rating para ${event.movie.title}:`, event.rating);
    // Aquí se enviaría la calificación al backend
  }

  scrollCarousel(carousel: 'top' | 'popular' | 'recommended' | 'genre' | 'liked', direction: 'left' | 'right'): void {
    let carouselElement: HTMLDivElement | undefined;

    switch(carousel) {
      case 'top':
        carouselElement = this.topCarousel?.nativeElement;
        break;
      case 'popular':
        carouselElement = this.popularCarousel?.nativeElement;
        break;
      case 'recommended':
        carouselElement = this.recommendedCarousel?.nativeElement;
        break;
      case 'genre':
        carouselElement = this.genreCarousel?.nativeElement;
        break;
      case 'liked':
        carouselElement = this.likedCarousel?.nativeElement;
        break;
    }

    if (!carouselElement) return;

    const scrollAmount = carouselElement.clientWidth * 0.8;
    const targetScroll = direction === 'left'
      ? carouselElement.scrollLeft - scrollAmount
      : carouselElement.scrollLeft + scrollAmount;

    carouselElement.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }

  updateCarouselButtons(carousel: 'top' | 'popular' | 'recommended' | 'genre' | 'liked'): void {
    let carouselElement: HTMLDivElement | undefined;
    let prevButton: HTMLButtonElement | undefined;
    let nextButton: HTMLButtonElement | undefined;

    switch(carousel) {
      case 'top':
        carouselElement = this.topCarousel?.nativeElement;
        prevButton = this.topPrev?.nativeElement;
        nextButton = this.topNext?.nativeElement;
        break;
      case 'popular':
        carouselElement = this.popularCarousel?.nativeElement;
        prevButton = this.popularPrev?.nativeElement;
        nextButton = this.popularNext?.nativeElement;
        break;
      case 'recommended':
        carouselElement = this.recommendedCarousel?.nativeElement;
        prevButton = this.recommendedPrev?.nativeElement;
        nextButton = this.recommendedNext?.nativeElement;
        break;
      case 'genre':
        carouselElement = this.genreCarousel?.nativeElement;
        prevButton = this.genrePrev?.nativeElement;
        nextButton = this.genreNext?.nativeElement;
        break;
      case 'liked':
        carouselElement = this.likedCarousel?.nativeElement;
        prevButton = this.likedPrev?.nativeElement;
        nextButton = this.likedNext?.nativeElement;
        break;
    }

    if (!carouselElement || !prevButton || !nextButton) return;

    const scrollLeft = carouselElement.scrollLeft;
    const scrollWidth = carouselElement.scrollWidth;
    const clientWidth = carouselElement.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    // Ocultar/mostrar botones basado en posición y si hay contenido suficiente
    const hasOverflow = scrollWidth > clientWidth;

    if (!hasOverflow) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    } else {
      prevButton.style.display = scrollLeft <= 5 ? 'none' : 'flex';
      nextButton.style.display = scrollLeft >= maxScroll - 5 ? 'none' : 'flex';
    }
  }

  getYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }
}
