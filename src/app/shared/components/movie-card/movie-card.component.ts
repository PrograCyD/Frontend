import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../models/movie.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, ImageFallbackDirective],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Input() showRating: boolean = true;
  @Input() showGenres: boolean = true;
  @Output() movieClick = new EventEmitter<Movie>();
  @Output() ratingChange = new EventEmitter<{movie: Movie, rating: number}>();

  onCardClick(): void {
    this.movieClick.emit(this.movie);
  }

  onRatingChange(rating: number): void {
    this.ratingChange.emit({ movie: this.movie, rating });
  }

  getYear(): string {
    if (!this.movie.releaseDate) return '';
    return new Date(this.movie.releaseDate).getFullYear().toString();
  }

  getGenreNames(): string[] {
    if (!this.movie.genres || this.movie.genres.length === 0) return [];
    return this.movie.genres.slice(0, 3);
  }

  getPosterUrl(): string {
    return this.movie.posterPath || '/assets/images/movie-placeholder.svg';
  }

  getAverageRating(): number {
    return this.movie.averageRating || 0;
  }
}
