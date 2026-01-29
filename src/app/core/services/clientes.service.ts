import { inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { cliente } from '../models/clientes.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private firestore = inject(Firestore);
  private clienteCollection = collection(this.firestore, 'clientes');

  //signals

  clientes = signal<cliente[]>([]);
  loading = signal(false);
  error = signal<string>('');

  constructor() {}

  async crearCliente(cliente: Omit<cliente, 'id'>) {
    try {
      console.log(cliente.nombre);
      if (this.clientes().find((c) => cliente.cedula === c.cedula)) {
        alert('Usuario ya existe con este numero de cedula ');
        this.loading.set(false);
        return;
      }
      const docRef = await addDoc(this.clienteCollection, {
        nombre: cliente.nombre,
        cedula: cliente.cedula,
        activo: cliente.activo,
        telefono: cliente.telefono,
        createdAt: new Date().getDay(),
      });
      console.log(docRef);

      console.log('Cliente creado con Id', docRef.id);
      this.loading.set(false);
    } catch (error: any) {
      console.error('Error creando Cliente: ', error);
      // return { success: false, error: error.message };
    }
  }

  async obtenerclientes(): Promise<cliente[] | any> {
    // A: Activar loading
    this.loading.set(true);

    try {
      // B: Obtener documentos
      const querySnapshot = await getDocs(this.clienteCollection);

      // C: Convertir a array
      const clientes = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as cliente,
      );

      // D: Actualizar signal
      this.clientes.set(clientes);

      // E: Desactivar loading
      this.loading.set(false);

      // F: Retornar
      return clientes;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      this.loading.set(false);
      return [];
    }
  }

  async getById(id: string): Promise<cliente | any> {
    try {
      // TODO: Crear referencia al documento
      const clienteRef = doc(this.firestore, 'clientes', id);
      // TODO: Obtener documento con getDoc
      const clienteSnap = await getDoc(clienteRef);
      // TODO: Verificar si existe

      if (clienteSnap.exists()) {
        return {
          id: clienteSnap.id,
          ...clienteSnap.data(),
        } as cliente;
      }

      // TODO: Retornar cliente o null
      return null;
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      return null;
    }
  }

  async actualizar(id: string, cambios: Partial<cliente>) {
    try {
      // TODO: Crear referencia al documento
      const clienteRef = doc(this.firestore, 'clientes', id);
      // TODO: Usar updateDoc con los cambios

      const clienteUpdate = await updateDoc(clienteRef, {
        ...cambios,
        updateAt: new Date(),
      });

      // TODO: Agregar updatedAt: new Date()
      // TODO: Retornar { success: true }
    } catch (error: any) {
      console.error('Error actualizando cliente:', error);
      // return { success: false, error: error.message };
    }
  }

  async eliminar(id: string): Promise<any> {
    try {
      // TODO: Crear referencia al documento

      const clienteDelete = doc(this.firestore, 'clientes', id);

      const eliminado = deleteDoc(clienteDelete);
      console.info(eliminado);
      return { success: true };
      // TODO: Eliminar con deleteDoc
      // TODO: Retornar { success: true }
    } catch (error: any) {
      console.error('Error eliminando cliente:', error);
      // return { success: false, error: error.message };
    }
  }
}
