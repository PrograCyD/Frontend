import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // ✅ Inyección de dependencias correcta para Angular standalone components
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;

    // ✅ MODO MOCK: Login con datos de prueba (ver AuthService para credenciales)
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.errorMessage.set(error.error || 'Credenciales inválidas. Intenta con las credenciales de prueba.');
        this.isLoading.set(false);
      }
    });
  }
}
