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
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        this.isLoading.set(false);

        // Si quisieras redirigir por rol:
        // const role = response.user.role;
        // this.router.navigate([role === 'admin' ? '/admin' : '/home']);

        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Error en login:', error);

        const backendMsg =
          (typeof error?.error === 'string' && error.error) ||
          error?.error?.message ||
          'Credenciales inválidas. Verifica tu email y contraseña.';

        this.errorMessage.set(backendMsg);
        this.isLoading.set(false);
      }
    });
  }
}
