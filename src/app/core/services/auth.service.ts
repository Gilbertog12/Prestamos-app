import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  // signal que contiene informacion de usuario actual

  currentUser = signal<User | null>(null);

  // observable del estado del auth

  user$ = user(this.auth);

  // computed signal para saber si esta logueado el usuario

  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    console.log(this.isLoggedIn());
    //TODO Sincronizar user$ con currentUser signal

    this.user$.subscribe((user) => {
      this.currentUser.set(user);

      console.log(this.currentUser());
    });

    effect(() => {
      console.log('Usuario actual:', this.currentUser());
      console.log('Está logueado:', this.isLoggedIn());
    });
  }

  // TODO: Método para login
  async login(email: string, password: string) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      console.info(user);
      if (user !== null) {
        // this.currentUser.set(user);
        console.info('Login Exitoso', user.user.email);
        this.router.navigate(['/dashboard']);
        // return { success: true };
      }
    } catch (error: any) {
      // return { success: false, error: error.code };

      console.error('Error:', error.code, error.message);
    }
  }

  // TODO: Método para registro
  async register(email: string, password: string) {
    try {
      const userRegister = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      if (userRegister !== null) {
        console.info('Usuario Creado', userRegister.user.uid);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      // return { success: false, mensaje: error.error };
      console.error('Error:', error.code, error.message);
    }
  }

  // TODO: Método para logout
  async logout() {
    // Implementar
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }
}
