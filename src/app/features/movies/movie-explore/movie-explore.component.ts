import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieExtended } from '../../../models/movie.model';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { mockMovies } from '../../../data/mock-movies';

@Component({
  selector: 'app-movie-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent],
  templateUrl: './movie-explore.component.html',
  styleUrl: './movie-explore.component.css'
})
export class MovieExploreComponent implements OnInit {
  searchQuery = signal('');
  selectedGenres = signal<string[]>([]);
  selectedCast = signal<string[]>([]);
  selectedDirectors = signal<string[]>([]);
  showFilters = signal(false);

  allMovies = signal<MovieExtended[]>([]);

  // Extract unique values for filters
  allGenres = computed(() => {
    const genres = new Set<string>();
    this.allMovies().forEach(movie => {
      movie.genres.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  });

  allCast = computed(() => {
    const cast = new Set<string>();
    this.allMovies().forEach(movie => {
      movie.cast?.forEach(actor => cast.add(actor));
    });
    return Array.from(cast).sort();
  });

  allDirectors = computed(() => {
    const directors = new Set<string>();
    this.allMovies().forEach(movie => {
      if (movie.director) {
        directors.add(movie.director);
      }
    });
    return Array.from(directors).sort();
  });

  // Filter movies based on search and filters
  filteredMovies = computed(() => {
    return this.allMovies().filter(movie => {
      // Search filter
      const matchesSearch = movie.title.toLowerCase().includes(this.searchQuery().toLowerCase());

      // Genre filter
      const matchesGenre = this.selectedGenres().length === 0 ||
        this.selectedGenres().some(genre => movie.genres.includes(genre));

      // Cast filter
      const matchesCast = this.selectedCast().length === 0 ||
        this.selectedCast().some(actor => movie.cast?.includes(actor));

      // Director filter
      const matchesDirector = this.selectedDirectors().length === 0 ||
        this.selectedDirectors().includes(movie.director || '');

      return matchesSearch && matchesGenre && matchesCast && matchesDirector;
    });
  });

  activeFiltersCount = computed(() =>
    this.selectedGenres().length + this.selectedCast().length + this.selectedDirectors().length
  );

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.allMovies.set(mockMovies);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  toggleFilters(): void {
    this.showFilters.update(value => !value);
  }

  toggleGenre(genre: string): void {
    this.selectedGenres.update(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  }

  toggleCast(actor: string): void {
    this.selectedCast.update(prev =>
      prev.includes(actor) ? prev.filter(a => a !== actor) : [...prev, actor]
    );
  }

  toggleDirector(director: string): void {
    this.selectedDirectors.update(prev =>
      prev.includes(director) ? prev.filter(d => d !== director) : [...prev, director]
    );
  }

  clearAllFilters(): void {
    this.selectedGenres.set([]);
    this.selectedCast.set([]);
    this.selectedDirectors.set([]);
    this.searchQuery.set('');
  }

  onMovieClick(movie: MovieExtended): void {
    this.router.navigate(['/movies', movie.movieId]);
  }
}
