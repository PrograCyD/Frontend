import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // Redirección inicial
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Rutas públicas de autenticación (solo para invitados)
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Layout principal con navbar
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home-welcome/home-welcome.component').then(m => m.HomeWelcomeComponent)
      },
      {
        path: 'movies',
        loadComponent: () => import('./features/movies/movie-explore/movie-explore.component').then(m => m.MovieExploreComponent)
      },
      {
        path: 'movies/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/movies/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent)
      },
      {
        path: 'recommendations',
        canActivate: [authGuard],
        loadComponent: () => import('./features/recommendations/recommendations.component').then(m => m.RecommendationsComponent)
      },
      {
        path: 'management',
        canActivate: [authGuard],
        loadComponent: () => import('./features/user/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'admin/management',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin/admin-management/admin-management.component').then(m => m.AdminManagementComponent)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/user/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Wildcard - ruta no encontrada
  {
    path: '**',
    redirectTo: 'home'
  }
];
