export interface Pago {
  id: string;

  // Datos del pago
  monto: number;
  fecha: Date;
  metodoPago: 'efectivo' | 'transferencia' | 'cheque' | 'otro';

  // Opcional
  numeroCuota?: number; // Cuota #1, #2, etc.
  observaciones?: string; // Notas adicionales

  // Auditoría
  registradoPor: string; // UID del usuario
  createdAt: Date;
  updatedAt?: Date;
}
