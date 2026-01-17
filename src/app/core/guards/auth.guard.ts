import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ Guard ejecutándose');

  // Usar user$ (Observable) en lugar de isLoggedIn (Signal)
  return authService.user$.pipe(
    take(1), // Tomar solo el primer valor
    map((user) => {
      console.log('Usuario en guard:', user);

      if (user) {
        console.log('✅ Permitiendo acceso');
        return true;
      }

      console.log('❌ Bloqueando acceso, redirigiendo a login');
      router.navigate(['/login']);
      return false;
    })
  );
};
