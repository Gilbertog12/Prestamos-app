import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'gprestamos-app',
        appId: '1:629595002813:web:f88a06bc29bba6cf87e4d4',
        storageBucket: 'gprestamos-app.firebasestorage.app',
        apiKey: 'AIzaSyCtWNx80XODitTpntZjlxP6J7JtKjNqUOY',
        authDomain: 'gprestamos-app.firebaseapp.com',
        messagingSenderId: '629595002813',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
