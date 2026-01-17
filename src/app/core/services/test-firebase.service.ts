import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TestFirebaseService {
  private firestore = inject(Firestore);

  async testWrite() {
    try {
      const testRef = collection(this.firestore, 'test');
      const docRef = await addDoc(testRef, {
        mensaje: 'Hola desde Angular',
        timestamp: new Date(),
      });

      console.log('Escritura Exitosa ID: ', docRef.id);
      return true;
    } catch (error) {
      console.error('Error Escribiendo :', error);
      return false;
    }
  }

  async testRead() {
    try {
      const testRef = collection(this.firestore, 'test');
      const querySnapshot = await getDocs(testRef);
      console.log('✅ Lectura exitosa!', querySnapshot.size, 'documentos');
      querySnapshot.forEach((doc) => {
        console.log('Documento:', doc.id, doc.data());
      });
      return true;
    } catch (error) {
      console.error('❌ Error leyendo:', error);
      return false;
    }
  }

  constructor() {}
}
