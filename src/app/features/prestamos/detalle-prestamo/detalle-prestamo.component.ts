import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { PrestamosService } from '../../../core/services/prestamos.service';
import { PagosService } from '../../../core/services/pagos.service';
import { Prestamo } from '../../../core/models/prestamo.interface';
import { Pago } from '../../../core/models/pago.interface';
import { formatearMoneda } from '../../../core/utils/calculos-prestamo';

@Component({
  selector: 'app-detalle-prestamo',
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    TitleCasePipe,
    DatePipe,
  ],
  templateUrl: './detalle-prestamo.component.html',
  styleUrl: './detalle-prestamo.component.scss',
})
export class DetallePrestamoComponent {
  private prestamosService = inject(PrestamosService);
  private pagosService = inject(PagosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  prestamo = signal<Prestamo | null>(null);
  pagos = signal<Pago[]>([]);
  loading = signal(false);

  formatearMoneda = formatearMoneda;

  // Computed: Total pagado (se calcula automáticamente)
  totalPagado = computed(() =>
    this.pagos().reduce((sum, pago) => sum + pago.monto, 0),
  );

  displayedColumns = ['fecha', 'monto', 'metodoPago', 'observaciones'];

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      await this.cargarDatos(id);
    }

    console.log('Hola desde el id ' + id);
  }

  async cargarDatos(prestamoId: string) {
    this.loading.set(true);

    try {
      const prestamoData = await this.prestamosService.getById(prestamoId);

      if (prestamoData) {
        const p: any = prestamoData;

        // Convertir todas las fechas de Timestamp a Date
        if (p.fechaPrestamo?.toDate) {
          prestamoData.fechaPrestamo = p.fechaPrestamo.toDate();
        }
        if (p.fechaVencimiento?.toDate) {
          prestamoData.fechaVencimiento = p.fechaVencimiento.toDate();
        }
        if (p.createdAt?.toDate) {
          prestamoData.createdAt = p.createdAt.toDate();
        }
        if (p.updatedAt?.toDate) {
          prestamoData.updatedAt = p.updatedAt.toDate();
        }
      }

      this.prestamo.set(prestamoData);

      // Cargar y convertir pagos
      const pagosData = await this.pagosService.getPagosPrestamo(prestamoId);
      const pagosConvertidos = pagosData.map((pago) => {
        const pg: any = pago;
        return {
          ...pago,
          fecha: pg.fecha?.toDate ? pg.fecha.toDate() : pago.fecha,
          createdAt: pg.createdAt?.toDate
            ? pg.createdAt.toDate()
            : pago.createdAt,
        };
      });

      this.pagos.set(pagosConvertidos);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  registrarPago() {
    const prestamo = this.prestamo();
    if (prestamo) {
      this.router.navigate(['/prestamos', prestamo.id, 'pago']);
    }
  }
}
