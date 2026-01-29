import { inject, Injectable, signal } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  runTransaction,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Pago } from '../models/pago.interface';
import { Prestamo } from '../models/prestamo.interface';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // Signals
  pagos = signal<Pago[]>([]);
  loading = signal(false);
  error = signal<string>('');

  constructor() {}

  async registrarPago(
    prestamoId: string,
    pagoData: {
      monto: number;
      metodoPago: 'efectivo' | 'transferencia' | 'cheque' | 'otro';
      observaciones?: string;
    },
  ) {
    const prestamoRef = doc(this.firestore, 'prestamos', prestamoId);

    try {
      await runTransaction(this.firestore, async (transaction) => {
        // 1. Leer préstamo actual
        const prestamoDoc = await transaction.get(prestamoRef);

        if (!prestamoDoc.exists()) {
          throw new Error('Préstamo no encontrado');
        }

        const prestamo = prestamoDoc.data() as Prestamo;

        // 2. Validaciones
        if (prestamo.estado === 'pagado') {
          throw new Error('El préstamo ya está pagado completamente');
        }

        if (pagoData.monto <= 0) {
          throw new Error('El monto debe ser mayor a cero');
        }

        if (pagoData.monto > prestamo.saldoPendiente) {
          throw new Error(
            `El pago ($${pagoData.monto.toLocaleString()}) excede el saldo pendiente ($${prestamo.saldoPendiente.toLocaleString()})`,
          );
        }

        // 3. Calcular nuevo saldo
        const nuevoSaldo = prestamo.saldoPendiente - pagoData.monto;
        const nuevoEstado = nuevoSaldo === 0 ? 'pagado' : 'activo';

        // 4. Actualizar préstamo
        transaction.update(prestamoRef, {
          saldoPendiente: nuevoSaldo,
          estado: nuevoEstado,
          updatedAt: new Date(),
        });

        // 5. Crear pago en subcolección
        const pagoRef = doc(collection(prestamoRef, 'pagos'));
        transaction.set(pagoRef, {
          monto: pagoData.monto,
          fecha: new Date(),
          metodoPago: pagoData.metodoPago,
          observaciones: pagoData.observaciones || '',
          registradoPor: this.auth.currentUser?.uid || '',
          createdAt: new Date(),
        });
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error registrando pago:', error);
      return { success: false, error: error.message };
    }
  }

  async getPagosPrestamo(prestamoId: string): Promise<Pago[]> {
    this.loading.set(true);
    this.error.set('');

    try {
      // Referencia a la subcolección
      const pagosRef = collection(
        this.firestore,
        'prestamos',
        prestamoId,
        'pagos',
      );

      // Query ordenada (más recientes primero)
      const q = query(pagosRef, orderBy('fecha', 'desc'));

      const querySnapshot = await getDocs(q);

      const pagos = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Pago,
      );

      this.pagos.set(pagos);
      this.loading.set(false);

      return pagos;
    } catch (error: any) {
      console.error('Error obteniendo pagos:', error);
      this.error.set(error.message);
      this.loading.set(false);
      return [];
    }
  }

  async getTotalPagado(prestamoId: string): Promise<number> {
    const pagos = await this.getPagosPrestamo(prestamoId);
    return pagos.reduce((total, pago) => total + pago.monto, 0);
  }

  async getPago(prestamoId: string, pagoId: string): Promise<Pago | null> {
    try {
      const pagoRef = doc(
        this.firestore,
        'prestamos',
        prestamoId,
        'pagos',
        pagoId,
      );

      const pagoSnap = await getDoc(pagoRef);

      if (pagoSnap.exists()) {
        return {
          id: pagoSnap.id,
          ...pagoSnap.data(),
        } as Pago;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      return null;
    }
  }
}
