import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../models/movie.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { ConfirmationService } from '../../../services/confirmation.service';

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

  private confirmationService = inject(ConfirmationService);

  onCardClick(): void {
    this.movieClick.emit(this.movie);
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

  getYear(): string {
    return this.movie.year?.toString() || '';
  }

  getGenreNames(): string[] {
    if (!this.movie.genres || this.movie.genres.length === 0) return [];
    return this.movie.genres.slice(0, 3);
  }

  getPosterUrl(): string {
    return this.movie.externalData?.posterUrl || '/assets/images/movie-placeholder.svg';
  }

  getAverageRating(): number {
    return this.movie.ratingStats?.average || 0;
  }
}
