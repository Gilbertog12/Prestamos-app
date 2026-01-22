export interface ResultadoCalculo {
  capital: number;
  tasaInteres: number;
  plazoMeses: number;
  numeroCuotas: number;
  interesTotal: number;
  totalAPagar: number;
  valorCuota: number;
}

export function calcularPrestamo(
  capital: number,
  tasaPorcentaje: number, // Ej: 5 para 5%
  plazoMeses: number,
  numeroCuotas: number,
): ResultadoCalculo {
  // Convertir porcentaje a decimal
  const tasaDecimal = tasaPorcentaje / 100;

  // Calcular interés simple: I = C × r × t
  const interesTotal = capital * tasaDecimal * plazoMeses;

  // Total a pagar
  const totalAPagar = capital + interesTotal;

  // Valor de cada cuota
  const valorCuota = totalAPagar / numeroCuotas;

  return {
    capital: Math.round(capital),
    tasaInteres: tasaDecimal,
    plazoMeses,
    numeroCuotas,
    interesTotal: Math.round(interesTotal),
    totalAPagar: Math.round(totalAPagar),
    valorCuota: Math.round(valorCuota),
  };
}

export function calcularFechaVencimiento(
  fechaPrestamo: Date,
  plazoMeses: number,
): Date {
  const fecha = new Date(fechaPrestamo);
  fecha.setMonth(fecha.getMonth() + plazoMeses);
  return fecha;
}

export function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(monto);
}
