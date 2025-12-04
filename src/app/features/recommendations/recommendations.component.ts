import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieExtended } from '../../models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { mockMovies } from '../../data/mock-movies';

type RecommendationType = 'collaborative' | 'content' | 'hybrid' | 'popular' | 'all';
type SortOption = 'relevance' | 'rating' | 'recent' | 'popular';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.css'
})
export class RecommendationsComponent implements OnInit {
  recommendationType = signal<RecommendationType>('all');
  sortBy = signal<SortOption>('relevance');
  minRating = signal<number>(0);
  selectedGenres = signal<string[]>([]);
  showFilters = signal(false);
  showGenreDropdown = signal(false);
  showTypeDropdown = signal(false);
  showSortDropdown = signal(false);
  showRatingDropdown = signal(false);

  allMovies = signal<MovieExtended[]>([]);

  // Available genres
  allGenres = computed(() => {
    const genres = new Set<string>();
    this.allMovies().forEach(movie => {
      movie.genres.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  });

  // Recommendation types info
  recommendationTypes = [
    {
      value: 'all' as RecommendationType,
      label: 'Todas',
      icon: 'apps',
      description: 'Todas las recomendaciones disponibles'
    },
    {
      value: 'collaborative' as RecommendationType,
      label: 'Colaborativas',
      icon: 'people',
      description: 'Basadas en usuarios similares a ti'
    },
    {
      value: 'content' as RecommendationType,
      label: 'Por Contenido',
      icon: 'category',
      description: 'Basadas en películas que te gustaron'
    },
    {
      value: 'hybrid' as RecommendationType,
      label: 'Híbridas',
      icon: 'auto_awesome',
      description: 'Combinación de múltiples técnicas'
    },
    {
      value: 'popular' as RecommendationType,
      label: 'Populares',
      icon: 'trending_up',
      description: 'Películas más populares actualmente'
    }
  ];

  // Sort options
  sortOptions = [
    { value: 'relevance' as SortOption, label: 'Más Relevantes', icon: 'star' },
    { value: 'rating' as SortOption, label: 'Mejor Calificadas', icon: 'grade' },
    { value: 'recent' as SortOption, label: 'Más Recientes', icon: 'schedule' },
    { value: 'popular' as SortOption, label: 'Más Populares', icon: 'local_fire_department' }
  ];

  // Rating options
  ratingOptions = [
    { value: 0, label: 'Todas las calificaciones', icon: 'star_border' },
    { value: 3, label: '3+ estrellas', icon: 'star_half' },
    { value: 4, label: '4+ estrellas', icon: 'star' },
    { value: 4.5, label: '4.5+ estrellas', icon: 'stars' }
  ];

  // Filter and sort recommendations
  filteredRecommendations = computed(() => {
    let movies = [...this.allMovies()];

    // Filter by recommendation type (mock)
    if (this.recommendationType() !== 'all') {
      // In a real app, this would filter by actual recommendation algorithm
      movies = movies.slice(0, Math.floor(movies.length * 0.7));
    }

    // Filter by genres
    if (this.selectedGenres().length > 0) {
      movies = movies.filter(movie =>
        this.selectedGenres().some(genre => movie.genres.includes(genre))
      );
    }

    // Filter by minimum rating
    if (this.minRating() > 0) {
      movies = movies.filter(movie => (movie.voteAverage || 0) >= this.minRating());
    }

    // Sort movies
    switch (this.sortBy()) {
      case 'rating':
        movies.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0));
        break;
      case 'recent':
        movies.sort((a, b) => {
          const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'popular':
        movies.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
        break;
      case 'relevance':
      default:
        // Keep original order (most relevant)
        break;
    }

    return movies;
  });

  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.recommendationType() !== 'all') count++;
    if (this.sortBy() !== 'relevance') count++;
    if (this.minRating() > 0) count++;
    count += this.selectedGenres().length;
    return count;
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simulate getting recommended movies
    this.allMovies.set(mockMovies.slice(0, 30));
  }

  toggleFilters(): void {
    this.showFilters.update(value => !value);
  }

  toggleGenreDropdown(): void {
    this.showGenreDropdown.update(value => !value);
  }

  toggleTypeDropdown(): void {
    this.showTypeDropdown.update(value => !value);
  }

  toggleSortDropdown(): void {
    this.showSortDropdown.update(value => !value);
  }

  toggleRatingDropdown(): void {
    this.showRatingDropdown.update(value => !value);
  }

  toggleGenre(genre: string): void {
    this.selectedGenres.update(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  }

  setRecommendationType(type: RecommendationType): void {
    this.recommendationType.set(type);
  }

  setSortBy(sort: SortOption): void {
    this.sortBy.set(sort);
  }

  setMinRating(rating: number): void {
    this.minRating.set(rating);
  }

  clearAllFilters(): void {
    this.recommendationType.set('all');
    this.sortBy.set('relevance');
    this.minRating.set(0);
    this.selectedGenres.set([]);
  }

  onMovieClick(movie: MovieExtended): void {
    this.router.navigate(['/movies', movie.movieId]);
  }

  getSelectedTypeInfo() {
    return this.recommendationTypes.find(t => t.value === this.recommendationType());
  }

  getSelectedSortInfo() {
    return this.sortOptions.find(s => s.value === this.sortBy());
  }

  getSelectedRatingInfo() {
    return this.ratingOptions.find(r => r.value === this.minRating());
  }
}
