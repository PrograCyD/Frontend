import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../models/movie.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { ConfirmationService } from '../../../services/confirmation.service';

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

  private confirmationService = inject(ConfirmationService);

  onCardClick(): void {
    this.movieClick.emit(this.movie);
  }

  getYear(): string {
    return this.movie.year?.toString() || '';
  }

  getGenreNames(): string[] {
    if (!this.movie.genres || this.movie.genres.length === 0) return [];
    return this.movie.genres.slice(0, 2);
  }

  getPosterUrl(): string {
    return this.movie.externalData?.posterUrl || '/assets/images/movie-placeholder.svg';
  }

  getAverageRating(): number {
    return this.movie.ratingStats?.average || 0;
  }

  getRankDisplay(): string {
    return `#${this.rank}`;
  }

  async onRatingChange(rating: number): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Confirmar calificación',
      message: `¿Deseas calificar "${this.movie.title}" con ${rating} estrella${rating !== 1 ? 's' : ''}?`,
      confirmText: 'Calificar',
      cancelText: 'Cancelar',
      type: 'info',
      icon: 'star'
    });

    if (confirmed) {
      this.ratingChange.emit({ movie: this.movie, rating });
    }
  }
}
