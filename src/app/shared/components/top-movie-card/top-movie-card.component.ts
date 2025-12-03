import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../models/movie.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';

@Component({
  selector: 'app-top-movie-card',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, ImageFallbackDirective],
  templateUrl: './top-movie-card.component.html',
  styleUrl: './top-movie-card.component.css'
})
export class TopMovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Input({ required: true }) rank!: number;
  @Output() movieClick = new EventEmitter<Movie>();
  @Output() ratingChange = new EventEmitter<{movie: Movie, rating: number}>();

  onCardClick(): void {
    this.movieClick.emit(this.movie);
  }

  getYear(): string {
    if (!this.movie.releaseDate) return '';
    return new Date(this.movie.releaseDate).getFullYear().toString();
  }

  getGenreNames(): string[] {
    if (!this.movie.genres || this.movie.genres.length === 0) return [];
    return this.movie.genres.slice(0, 2);
  }

  getPosterUrl(): string {
    return this.movie.posterPath || '/assets/images/movie-placeholder.svg';
  }

  getAverageRating(): number {
    return this.movie.averageRating || 0;
  }

  getRankDisplay(): string {
    return `#${this.rank}`;
  }

  onRatingChange(rating: number): void {
    this.ratingChange.emit({ movie: this.movie, rating });
  }
}
