export interface Prestamo {
  id: string;

  // Vinculación con cliente
  clienteId: string;
  clienteNombre: string; // Desnormalizado
  clienteCedula: string; // Desnormalizado

  // Montos (interés simple)
  capital: number; // Monto prestado
  tasaInteres: number; // En decimal: 0.05 = 5%
  plazoMeses: number; // Duración del préstamo
  numeroCuotas: number; // Cantidad de pagos

  // Cálculos (guardados para no recalcular)
  interesTotal: number; // capital × tasa × plazo
  totalAPagar: number; // capital + interés
  valorCuota: number; // total ÷ cuotas

  // Estado actual
  saldoPendiente: number; // Cuánto falta por pagar
  estado: 'activo' | 'pagado' | 'vencido';

  // Fechas
  fechaPrestamo: Date;
  fechaVencimiento: Date;

  // Auditoría
  createdAt: Date;
  updatedAt: Date;
  creadoPor: string; // UID del usuario
}
