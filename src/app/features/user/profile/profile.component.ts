import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { MovieExtended } from '../../../models/movie.model';
import { mockMovies } from '../../../data/mock-movies';
import { AuthService } from '../../../services/auth.service';
import { UpdateUserRequest } from '../../../models/user.model';

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
  private router = inject(Router);
  private authService = inject(AuthService);

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
    about: '',
    preferredGenres: [] as string[]
  });

  // Géneros disponibles
  availableGenres = [
    'Acción', 'Aventura', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción',
    'Romance', 'Thriller', 'Fantasía', 'Misterio', 'Histórico', 'Independiente'
  ];

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserRatings(); // sigue siendo mock por ahora
  }

  private loadUserProfile(): void {
    const current = this.authService.currentUser();
    if (!current) {
      this.router.navigate(['/login']);
      return;
    }
    this.user.set(current);
    this.syncEditForm();
  }

  private loadUserRatings(): void {
    this.isLoading.set(true);

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

      const ratingsWithMovies = mockRatings.map(rating => ({
        ...rating,
        movie: mockMovies.find(m => m.movieId === rating.movieId)
      }));

      this.userRatings.set(ratingsWithMovies);
      this.isLoading.set(false);
    }, 500);
  }

  private syncEditForm(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.editForm.set({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        about: currentUser.about || '',
        preferredGenres: [...(currentUser.preferredGenres || [])]
      });
    }
  }

  // ------------ Perfil básico (nombre, email, username) ------------

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
    if (!currentUser) return;

    const form = this.editForm();
    const payload: UpdateUserRequest = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email
    };

    this.isLoading.set(true);

    this.authService.updateUser(currentUser.userId, payload).subscribe({
      next: (res) => {
        if (res.updated) {
          const updatedUser: User = {
            ...currentUser,
            ...payload
          };
          this.user.set(updatedUser);
          this.authService.currentUser.set(updatedUser);
        }
        this.isEditingProfile.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        this.isLoading.set(false);
      }
    });
  }

  // ------------ Biografía ------------

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
    if (!currentUser) return;

    const payload: UpdateUserRequest = {
      about: this.editForm().about
    };

    this.isLoading.set(true);

    this.authService.updateUser(currentUser.userId, payload).subscribe({
      next: (res) => {
        if (res.updated) {
          const updatedUser: User = {
            ...currentUser,
            about: payload.about
          };
          this.user.set(updatedUser);
          this.authService.currentUser.set(updatedUser);
        }
        this.isEditingBio.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error actualizando biografía:', err);
        this.isLoading.set(false);
      }
    });
  }

  // ------------ Géneros favoritos ------------

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
    if (!currentUser) return;

    const payload: UpdateUserRequest = {
      preferredGenres: [...this.editForm().preferredGenres]
    };

    this.isLoading.set(true);

    this.authService.updateUser(currentUser.userId, payload).subscribe({
      next: (res) => {
        if (res.updated) {
          const updatedUser: User = {
            ...currentUser,
            preferredGenres: payload.preferredGenres
          };
          this.user.set(updatedUser);
          this.authService.currentUser.set(updatedUser);
        }
        this.isEditingGenres.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error actualizando géneros:', err);
        this.isLoading.set(false);
      }
    });
  }

  toggleGenre(genre: string): void {
    const form = this.editForm();
    const genres = [...form.preferredGenres];
    const index = genres.indexOf(genre);

    if (index > -1) {
      genres.splice(index, 1);
    } else {
      genres.push(genre);
    }

    this.editForm.set({ ...form, preferredGenres: genres });
  }

  isGenreSelected(genre: string): boolean {
    return this.editForm().preferredGenres.includes(genre);
  }

  // ------------ Navegación ------------

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
