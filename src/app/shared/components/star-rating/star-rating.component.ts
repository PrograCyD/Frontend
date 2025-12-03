import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() maxStars: number = 5;
  @Input() readonly: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() ratingChange = new EventEmitter<number>();

  hoveredStar = signal<number>(0);

  get stars(): number[] {
    return Array(this.maxStars).fill(0).map((_, i) => i + 1);
  }

  getStarType(star: number): 'full' | 'half' | 'empty' {
    const currentRating = this.hoveredStar() || this.rating;

    if (currentRating >= star) {
      return 'full';
    } else if (currentRating >= star - 0.5) {
      return 'half';
    } else {
      return 'empty';
    }
  }

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.rating = star;
      this.ratingChange.emit(star);
    }
  }

  onStarHover(star: number): void {
    if (!this.readonly) {
      this.hoveredStar.set(star);
    }
  }

  onMouseLeave(): void {
    if (!this.readonly) {
      this.hoveredStar.set(0);
    }
  }

  getSizeClass(): string {
    const sizeMap = {
      'sm': 'star-sm',
      'md': 'star-md',
      'lg': 'star-lg'
    };
    return sizeMap[this.size];
  }
}
