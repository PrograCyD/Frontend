import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { MovieExtended } from '../../../models/movie.model';
import { mockMovies } from '../../../data/mock-movies';

interface UserRating {
  movieId: number;
  rating: number;
  timestamp: number;
  movie?: MovieExtended;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);
  userRatings = signal<UserRating[]>([]);
  isLoading = signal(false);
  isEditingProfile = signal(false);
  isEditingBio = signal(false);
  isEditingGenres = signal(false);

  // Form fields para edición
  editForm = signal({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
    favoriteGenres: [] as string[]
  });

  // Géneros disponibles
  availableGenres = ['Acción', 'Aventura', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción',
                     'Romance', 'Thriller', 'Fantasía', 'Misterio', 'Histórico', 'Independiente'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserRatings();
  }

  loadUserProfile(): void {
    // Mock user data
    const mockUser: User = {
      userId: 1,
      email: 'user@cinematch.com',
      username: 'cinefilo2024',
      firstName: 'Juan',
      lastName: 'Pérez',
      bio: 'Amante del cine clásico y las películas independientes. Siempre buscando nuevas historias que contar.',
      favoriteGenres: ['Acción', 'Ciencia Ficción', 'Drama'],
      role: 'user',
      createdAt: new Date('2024-01-15')
    };

    this.user.set(mockUser);
    this.syncEditForm();
  }

  loadUserRatings(): void {
    this.isLoading.set(true);

    // Simulate API call with mock data
    setTimeout(() => {
      const mockRatings: UserRating[] = [
        { movieId: 1, rating: 5, timestamp: Date.now() - 86400000 },
        { movieId: 2, rating: 4.5, timestamp: Date.now() - 172800000 },
        { movieId: 3, rating: 4, timestamp: Date.now() - 259200000 },
        { movieId: 4, rating: 5, timestamp: Date.now() - 345600000 },
        { movieId: 5, rating: 3.5, timestamp: Date.now() - 432000000 },
        { movieId: 6, rating: 4.5, timestamp: Date.now() - 518400000 },
        { movieId: 7, rating: 4, timestamp: Date.now() - 604800000 },
        { movieId: 8, rating: 5, timestamp: Date.now() - 691200000 }
      ];

      // Attach movie data
      const ratingsWithMovies = mockRatings.map(rating => ({
        ...rating,
        movie: mockMovies.find(m => m.movieId === rating.movieId)
      }));

      this.userRatings.set(ratingsWithMovies);
      this.isLoading.set(false);
    }, 500);
  }

  syncEditForm(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.editForm.set({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        favoriteGenres: [...(currentUser.favoriteGenres || [])]
      });
    }
  }

  startEditingProfile(): void {
    this.syncEditForm();
    this.isEditingProfile.set(true);
  }

  cancelEditProfile(): void {
    this.isEditingProfile.set(false);
    this.syncEditForm();
  }

  saveProfile(): void {
    const currentUser = this.user();
    if (currentUser) {
      const form = this.editForm();
      this.user.set({
        ...currentUser,
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email
      });
      this.isEditingProfile.set(false);
      console.log('Perfil guardado:', this.user());
    }
  }

  startEditingBio(): void {
    this.syncEditForm();
    this.isEditingBio.set(true);
  }

  cancelEditBio(): void {
    this.isEditingBio.set(false);
    this.syncEditForm();
  }

  saveBio(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.user.set({
        ...currentUser,
        bio: this.editForm().bio
      });
      this.isEditingBio.set(false);
      console.log('Biografía guardada');
    }
  }

  startEditingGenres(): void {
    this.syncEditForm();
    this.isEditingGenres.set(true);
  }

  cancelEditGenres(): void {
    this.isEditingGenres.set(false);
    this.syncEditForm();
  }

  saveGenres(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.user.set({
        ...currentUser,
        favoriteGenres: [...this.editForm().favoriteGenres]
      });
      this.isEditingGenres.set(false);
      console.log('Géneros favoritos guardados');
    }
  }

  toggleGenre(genre: string): void {
    const form = this.editForm();
    const genres = form.favoriteGenres;
    const index = genres.indexOf(genre);

    if (index > -1) {
      genres.splice(index, 1);
    } else {
      genres.push(genre);
    }

    this.editForm.set({ ...form, favoriteGenres: [...genres] });
  }

  isGenreSelected(genre: string): boolean {
    return this.editForm().favoriteGenres.includes(genre);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  goToMovie(movieId: number): void {
    this.router.navigate(['/movies', movieId]);
  }

  getMemberSince(): string {
    const createdAt = this.user()?.createdAt;
    if (!createdAt) return 'Desconocido';

    const date = new Date(createdAt);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  }
}
