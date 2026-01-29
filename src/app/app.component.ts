import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthService } from './core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButton,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'prestamos-app';

  authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn;
  userEmail = computed(() => this.authService.currentUser()?.email ?? '');

  async logout() {
    this.authService.logout();
  }
}
