import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-layout">
      <app-navbar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--background);
    }

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1920px;
      margin: 0 auto;
      padding: var(--spacing-xl);
    }

    @media (max-width: 768px) {
      .main-content {
        padding: var(--spacing-lg);
      }
    }

    @media (max-width: 480px) {
      .main-content {
        padding: var(--spacing-md);
      }
    }
  `]
})
export class HomeComponent {}
