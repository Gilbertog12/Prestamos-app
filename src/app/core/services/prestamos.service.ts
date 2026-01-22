import { inject, Injectable, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Prestamo } from '../models/prestamo.interface';
import { ClientesService } from './clientes.service';
import {
  calcularPrestamo,
  calcularFechaVencimiento,
} from '../utils/calculos-prestamo';

@Injectable({
  providedIn: 'root',
})
export class PrestamosService {
  constructor() {}

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private clientesService = inject(ClientesService);

  private prestamosCollection = collection(this.firestore, 'prestamos');

  // Signals
  prestamos = signal<Prestamo[]>([]);
  loading = signal(false);
  error = signal<string>('');

  // TODO: Implementar métodos

  async crear(prestamoData: {
    clienteId: string;
    capital: number;
    tasaPorcentaje: number;
    plazoMeses: number;
    numeroCuotas: number;
  }) {
    try {
      // 1. Obtener datos del cliente
      const cliente = await this.clientesService.getById(
        prestamoData.clienteId,
      );

      if (!cliente) {
        return { success: false, error: 'Cliente no encontrado' };
      }

      // 2. Calcular valores del préstamo
      const calculo = calcularPrestamo(
        prestamoData.capital,
        prestamoData.tasaPorcentaje,
        prestamoData.plazoMeses,
        prestamoData.numeroCuotas,
      );

      // 3. Calcular fecha de vencimiento
      const fechaPrestamo = new Date();
      const fechaVencimiento = calcularFechaVencimiento(
        fechaPrestamo,
        prestamoData.plazoMeses,
      );

      // 4. Crear objeto préstamo
      const prestamo = {
        // Vinculación con cliente (ID + desnormalización)
        clienteId: cliente.id,
        clienteNombre: cliente.nombre,
        clienteCedula: cliente.cedula,

        // Datos del cálculo
        capital: calculo.capital,
        tasaInteres: calculo.tasaInteres,
        plazoMeses: calculo.plazoMeses,
        numeroCuotas: calculo.numeroCuotas,
        interesTotal: calculo.interesTotal,
        totalAPagar: calculo.totalAPagar,
        valorCuota: calculo.valorCuota,

        // Estado inicial
        saldoPendiente: calculo.totalAPagar,
        estado: 'activo' as const,

        // Fechas
        fechaPrestamo,
        fechaVencimiento,

        // Auditoría
        createdAt: new Date(),
        updatedAt: new Date(),
        creadoPor: this.auth.currentUser?.uid || '',
      };

      // 5. Guardar en Firestore
      const docRef = await addDoc(this.prestamosCollection, prestamo);

      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Error creando préstamo:', error);
      return { success: false, error: error.message };
    }
  }

  async getAll(): Promise<Prestamo[]> {
    this.loading.set(true);
    this.error.set('');

    try {
      // Query ordenada por fecha (más recientes primero)
      const q = query(
        this.prestamosCollection,
        orderBy('fechaPrestamo', 'desc'),
      );

      const querySnapshot = await getDocs(q);

      const prestamos = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Prestamo,
      );

      this.prestamos.set(prestamos);
      this.loading.set(false);

      return prestamos;
    } catch (error: any) {
      console.error('Error obteniendo préstamos:', error);
      this.error.set(error.message);
      this.loading.set(false);
      return [];
    }
  }

  async getById(id: string): Promise<Prestamo | null> {
    try {
      const docRef = doc(this.firestore, 'prestamos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Prestamo;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo préstamo:', error);
      return null;
    }
  }

  async getByCliente(clienteId: string): Promise<Prestamo[]> {
    try {
      const q = query(
        this.prestamosCollection,
        where('clienteId', '==', clienteId),
        orderBy('fechaPrestamo', 'desc'),
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Prestamo,
      );
    } catch (error) {
      console.error('Error obteniendo préstamos del cliente:', error);
      return [];
    }
  }

  async getByEstado(
    estado: 'activo' | 'pagado' | 'vencido',
  ): Promise<Prestamo[]> {
    try {
      const q = query(
        this.prestamosCollection,
        where('estado', '==', estado),
        orderBy('fechaPrestamo', 'desc'),
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Prestamo,
      );
    } catch (error) {
      console.error('Error obteniendo préstamos por estado:', error);
      return [];
    }
  }

  async actualizarEstado(
    id: string,
    nuevoEstado: 'activo' | 'pagado' | 'vencido',
  ) {
    try {
      await updateDoc(doc(this.firestore, 'prestamos', id), {
        estado: nuevoEstado,
        updatedAt: new Date(),
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error actualizando estado:', error);
      return { success: false, error: error.message };
    }
  }

  async actualizarSaldo(id: string, nuevoSaldo: number) {
    try {
      // Verificar si el préstamo está completamente pagado
      const estado = nuevoSaldo <= 0 ? 'pagado' : 'activo';

      await updateDoc(doc(this.firestore, 'prestamos', id), {
        saldoPendiente: nuevoSaldo,
        estado,
        updatedAt: new Date(),
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error actualizando saldo:', error);
      return { success: false, error: error.message };
    }
  }

  async eliminar(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'prestamos', id));
      return { success: true };
    } catch (error: any) {
      console.error('Error eliminando préstamo:', error);
      return { success: false, error: error.message };
    }
  }
}
