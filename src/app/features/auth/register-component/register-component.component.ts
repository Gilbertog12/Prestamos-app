import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './register-component.component.html',
  styleUrl: './register-component.component.scss',
})
export class RegisterComponentComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // Signal para mostrar errores
  errorMessage = signal<string>('');

  // Signal para loading
  loading = signal<boolean>(false);

  // Formulario reactivo
  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, confirmPassword } = this.loginForm.value;

    if (password !== confirmPassword) {
      console.error('las contraseñas deben coincidir');
      return;
    }

    this.authService.register(email, password);
  }
}
