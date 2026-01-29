import {
  Component,
  Input,
  OnInit,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { PrestamosService } from '../../../core/services/prestamos.service';
import { ReportesService } from '../../../core/services/reportes.service';
import { Prestamo } from '../../../core/models/prestamo.interface';
import { formatearMoneda } from '../../../core/utils/calculos-prestamo';

@Component({
  selector: 'app-reporte-prestamos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
  ],
  templateUrl: './reporte-prestamos.component.html',
  styleUrl: './reporte-prestamos.component.scss',
})
export class ReportePrestamosComponent implements OnInit {
  @Input() fechaDesde!: Date;
  @Input() fechaHasta!: Date;

  private prestamosService = inject(PrestamosService);
  private reportesService = inject(ReportesService);

  prestamos = signal<Prestamo[]>([]);
  loading = signal(false);

  displayedColumns = [
    'cliente',
    'capital',
    'total',
    'saldo',
    'estado',
    'fecha',
  ];

  formatearMoneda = formatearMoneda;

  prestamosFiltrados = computed(() => {
    return this.prestamos().filter((p) => {
      const fecha = p.fechaPrestamo;
      return fecha >= this.fechaDesde && fecha <= this.fechaHasta;
    });
  });

  resumen = computed(() => {
    const prestamos = this.prestamosFiltrados();
    return {
      cantidad: prestamos.length,
      totalCapital: prestamos.reduce((s, p) => s + p.capital, 0),
      totalIntereses: prestamos.reduce((s, p) => s + p.interesTotal, 0),
      totalAPagar: prestamos.reduce((s, p) => s + p.totalAPagar, 0),
      totalPendiente: prestamos.reduce((s, p) => s + p.saldoPendiente, 0),
    };
  });

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.loading.set(true);
    try {
      const prestamosData = await this.prestamosService.getAll();

      const prestamosConvertidos = prestamosData.map((p) => {
        const prestamo: any = p;
        return {
          ...p,
          fechaPrestamo: prestamo.fechaPrestamo?.toDate
            ? prestamo.fechaPrestamo.toDate()
            : p.fechaPrestamo,
          fechaVencimiento: prestamo.fechaVencimiento?.toDate
            ? prestamo.fechaVencimiento.toDate()
            : p.fechaVencimiento,
        };
      });

      this.prestamos.set(prestamosConvertidos);
    } catch (error) {
      console.error('Error cargando préstamos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  exportarAExcel() {
    const datos = this.prestamosFiltrados().map((p) => ({
      Cliente: p.clienteNombre,
      Cédula: p.clienteCedula,
      Capital: p.capital,
      Interés: p.interesTotal,
      Total: p.totalAPagar,
      Saldo: p.saldoPendiente,
      Estado: p.estado,
      Fecha: p.fechaPrestamo.toLocaleDateString('es-CO'),
    }));

    const nombreArchivo = `prestamos-${this.formatearFechaArchivo(this.fechaDesde)}-${this.formatearFechaArchivo(this.fechaHasta)}`;
    this.reportesService.exportarAExcel(datos, nombreArchivo, 'Préstamos');
  }

  exportarAPDF() {
    const datos = this.prestamosFiltrados().map((p) => [
      p.clienteNombre,
      formatearMoneda(p.capital),
      formatearMoneda(p.totalAPagar),
      formatearMoneda(p.saldoPendiente),
      p.estado,
      p.fechaPrestamo.toLocaleDateString('es-CO'),
    ]);

    const columnas = [
      'Cliente',
      'Capital',
      'Total',
      'Saldo',
      'Estado',
      'Fecha',
    ];
    const nombreArchivo = `prestamos-${this.formatearFechaArchivo(this.fechaDesde)}-${this.formatearFechaArchivo(this.fechaHasta)}`;

    this.reportesService.exportarAPDF(
      datos,
      columnas,
      'Reporte de Préstamos',
      nombreArchivo,
    );
  }

  formatearFechaArchivo(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO').replace(/\//g, '-');
  }
}
