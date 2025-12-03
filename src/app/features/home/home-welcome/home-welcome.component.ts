import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MovieExtended } from '../../../models/movie.model';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { TopMovieCardComponent } from '../../../shared/components/top-movie-card/top-movie-card.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
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
export class HomeWelcomeComponent implements OnInit {
  featuredMovie = signal<MovieExtended | null>(null);
  topMovies = signal<MovieExtended[]>([]);
  recommendedMovies = signal<MovieExtended[]>([]);
  genreRecommendations = signal<MovieExtended[]>([]);
  becauseYouLikedMovies = signal<MovieExtended[]>([]);

  // Estado para el rating del hero
  heroRating = signal<number>(0);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.featuredMovie.set(getFeaturedMovie());
    this.topMovies.set(getTopRatedMovies(10));
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

  onHeroRatingChange(rating: number): void {
    this.heroRating.set(rating);
    console.log('Rating del Hero:', rating);
    // Aquí se enviaría la calificación al backend
  }

  onTopMovieRatingChange(event: {movie: MovieExtended, rating: number}): void {
    console.log(`Rating para ${event.movie.title}:`, event.rating);
    // Aquí se enviaría la calificación al backend
    // Por ahora solo mostramos en consola
  }

  onMovieRatingChange(event: {movie: MovieExtended, rating: number}): void {
    console.log(`Rating para ${event.movie.title}:`, event.rating);
    // Aquí se enviaría la calificación al backend
  }

  getYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }
}
