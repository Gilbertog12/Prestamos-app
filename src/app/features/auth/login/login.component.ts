import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // Signal para mostrar errores
  errorMessage = signal<string>('');

  // Signal para loading
  loading = signal<boolean>(false);

  // Formulario reactivo
  loginForm: FormGroup;

  constructor() {
    // TODO: Inicializar formulario con FormBuilder
    this.loginForm = this.fb.group({
      email: [
        'ggalindo@prestamos.com',
        [Validators.required, Validators.email],
      ],
      password: ['qwerty', [Validators.required, Validators.minLength(6)]],
    });
    // Campos: email y password
    // Validaciones: email requerido y válido, password requerido
  }

  async onSubmit() {
    // TODO: Validar que el form sea válido

    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    // TODO: Obtener valores del formulario

    const { email, password } = this.loginForm.value;
    console.log(email, password);
    // TODO: Llamar a authService.login()

    const result = await this.authService.login(email, password);
    // TODO: Manejar respuesta (éxito o error)
  }
}
