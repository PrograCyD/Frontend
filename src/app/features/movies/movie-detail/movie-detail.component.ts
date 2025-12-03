import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieExtended } from '../../../models/movie.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { mockMovies } from '../../../data/mock-movies';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, MovieCardComponent],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {
  movie = signal<MovieExtended | null>(null);
  userRating = signal(0);
  isLoading = signal(false);

  // Compute similar movies based on shared genres and tags
  similarMovies = computed(() => {
    const currentMovie = this.movie();
    if (!currentMovie) return [];

    return mockMovies
      .filter(m => m.movieId !== currentMovie.movieId)
      .map(m => {
        let score = 0;

        // Score based on shared genres
        const sharedGenres = m.genres.filter((g: string) => currentMovie.genres.includes(g));
        score += sharedGenres.length * 3;

        // Score based on shared tags
        const sharedTags = (m.tags || []).filter((t: string) => (currentMovie.tags || []).includes(t));
        score += sharedTags.length;

        return { movie: m, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.movie);
  });

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

    this.loadMovie(parseInt(movieId));
  }

  loadMovie(id: number): void {
    this.isLoading.set(true);

    // Simulate API call with mock data
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

  onRatingChange(rating: number): void {
    this.userRating.set(rating);
    // TODO: Save rating to backend
    console.log('Rating changed:', rating);
  }

  onSimilarMovieClick(movie: MovieExtended): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/movies', movie.movieId]);
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getYear(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear().toString();
  }

  getMovieLensUrl(movieLensId: number | undefined): string {
    if (!movieLensId) return '#';
    return `https://movielens.org/movies/${movieLensId}`;
  }

  getImdbUrl(imdbId: string | undefined): string {
    if (!imdbId) return '#';
    return `https://www.imdb.com/title/${imdbId}`;
  }

  getTmdbUrl(tmdbId: number | undefined): string {
    if (!tmdbId) return '#';
    return `https://www.themoviedb.org/movie/${tmdbId}`;
  }
}
