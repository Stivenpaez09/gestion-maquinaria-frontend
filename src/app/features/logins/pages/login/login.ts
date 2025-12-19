import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  loginError: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      this.authService.login(this.loginForm.value as LoginRequest).subscribe({
        next: () => {
          const rol = this.authService.obtenerRol() || 'OPERADOR';
          if (rol === 'ADMIN') {
            this.router.navigate(['/dashboard-admin']);
          }
          if (rol === 'RESPONSABLE_DE_MANTENIMIENTO') {
            this.router.navigate(['/dashboard-responsable']);
          }
          if (rol === 'TECNICO_DE_MANTENIMIENTO') {
            this.router.navigate(['/dashboard-tecnico']);
          }
          if (rol === 'OPERADOR') {
            this.router.navigate(['/dashboard-operador']);
          }
        },
        error: (err) => {
          this.loginError = err.error?.message || 'Error al inciar sesion, intentelo de nuevo';
          this.isLoading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginError = 'Por favor, complete los campos correctamente';
    }
  }
}
