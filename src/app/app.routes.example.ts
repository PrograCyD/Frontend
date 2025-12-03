/**
 * Ejemplo de Rutas Completas con Guards
 *
 * Este archivo muestra cómo configurar todas las rutas
 * de la aplicación usando los guards implementados.
 *
 * Puedes copiar este contenido a app.routes.ts
 */

import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  // ===========================================
  // Ruta por defecto
  // ===========================================
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  // ===========================================
  // Rutas PÚBLICAS (sin guards)
  // ===========================================
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'movies',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/movie-list/movie-list.component').then(m => m.MovieListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent)
      }
    ]
  },

  // ===========================================
  // Rutas solo para NO AUTENTICADOS (guestGuard)
  // ===========================================
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },

  // ===========================================
  // Rutas PROTEGIDAS (authGuard)
  // Requieren que el usuario esté autenticado
  // ===========================================
  {
    path: 'my-recommendations',
    loadComponent: () => import('./pages/my-recommendations/my-recommendations.component').then(m => m.MyRecommendationsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-ratings',
    loadComponent: () => import('./pages/my-ratings/my-ratings.component').then(m => m.MyRatingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },

  // ===========================================
  // Rutas de ADMIN (authGuard + adminGuard)
  // Requieren autenticación Y rol de admin
  // ===========================================
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/users/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./pages/admin/users/user-detail.component').then(m => m.UserDetailComponent)
      },
      {
        path: 'users/:id/recommendations',
        loadComponent: () => import('./pages/admin/user-recommendations/user-recommendations.component').then(m => m.UserRecommendationsComponent)
      },
      {
        path: 'system',
        loadComponent: () => import('./pages/admin/system/system-health.component').then(m => m.SystemHealthComponent)
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./pages/admin/maintenance/maintenance.component').then(m => m.MaintenanceComponent)
      }
    ]
  },

  // ===========================================
  // Ruta de testing (temporal)
  // ===========================================
  {
    path: 'test',
    loadComponent: () => import('./pages/service-tester.component').then(m => m.ServiceTesterComponent)
  },

  // ===========================================
  // 404 - Ruta no encontrada
  // ===========================================
  {
    path: '**',
    redirectTo: '/home'
  }
];

/**
 * RESUMEN DE PROTECCIÓN DE RUTAS:
 *
 * ✅ Públicas (todos):
 *    /home
 *    /movies
 *    /movies/:id
 *
 * 🔒 Solo no autenticados (guestGuard):
 *    /login
 *    /register
 *
 * 🔐 Solo autenticados (authGuard):
 *    /my-recommendations
 *    /my-ratings
 *    /profile
 *
 * 👑 Solo admin (authGuard + adminGuard):
 *    /admin/**
 */
