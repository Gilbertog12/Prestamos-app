import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  constructor() {}

  exportarAExcel(
    datos: any[],
    nombreArchivo: string,
    nombreHoja: string = 'Datos',
  ) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(datos);

    XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
    XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
  }

  exportarAPDF(
    datos: any[][],
    columnas: string[],
    titulo: string,
    nombreArchivo: string,
  ) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(titulo, 14, 20);

    doc.setFontSize(10);
    const fecha = new Date().toLocaleDateString('es-CO');
    doc.text(`Fecha: ${fecha}`, 14, 30);

    autoTable(doc, {
      head: [columnas],
      body: datos,
      startY: 35,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [103, 126, 234] },
    });

    doc.save(`${nombreArchivo}.pdf`);
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(monto);
  }
}
