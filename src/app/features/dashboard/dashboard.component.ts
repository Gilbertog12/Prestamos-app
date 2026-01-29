import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Prestamo } from '../../core/models/prestamo.interface';
import { PrestamosService } from '../../core/services/prestamos.service';
import { formatearMoneda } from '../../core/utils/calculos-prestamo';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements AfterViewInit {
  private prestamosService = inject(PrestamosService);

  @ViewChild('graficoBarras') graficoBarrasRef!: ElementRef;
  @ViewChild('graficoPastel') graficoPastelRef!: ElementRef;

  private chartBarras: any;
  private chartPastel: any;

  // Signals
  prestamos = signal<Prestamo[]>([]);
  loading = signal(false);

  formatearMoneda = formatearMoneda;

  // Computed values
  totalPrestado = computed(() =>
    this.prestamos().reduce((sum, p) => sum + p.totalAPagar, 0),
  );

  totalPendiente = computed(() =>
    this.prestamos().reduce((sum, p) => sum + p.saldoPendiente, 0),
  );

  totalCobrado = computed(() => this.totalPrestado() - this.totalPendiente());

  prestamosActivos = computed(
    () => this.prestamos().filter((p) => p.estado === 'activo').length,
  );

  proximosVencer = computed(() => {
    const hoy = new Date();
    const en7Dias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.prestamos()
      .filter((p) => {
        if (p.estado !== 'activo') return false;
        const vencimiento = p.fechaVencimiento;
        return vencimiento >= hoy && vencimiento <= en7Dias;
      })
      .sort(
        (a, b) => a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime(),
      );
  });

  async ngOnInit() {
    await this.cargarDatos();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.prestamos().length > 0) {
        this.crearGraficoBarras();
        this.crearGraficoPastel();
      }
    }, 100);
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

      // Crear gráficos después de cargar datos
      setTimeout(() => {
        this.crearGraficoBarras();
        this.crearGraficoPastel();
      }, 100);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  crearGraficoBarras() {
    if (!this.graficoBarrasRef) return;

    // Destruir gráfico anterior si existe
    if (this.chartBarras) {
      this.chartBarras.destroy();
    }

    const grupos = this.agruparPorMes(this.prestamos());
    const labels = Array.from(grupos.keys());
    const data = Array.from(grupos.values());

    this.chartBarras = new Chart(this.graficoBarrasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Préstamos',
            data: data,
            backgroundColor: '#4CAF50',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  crearGraficoPastel() {
    if (!this.graficoPastelRef) return;

    // Destruir gráfico anterior si existe
    if (this.chartPastel) {
      this.chartPastel.destroy();
    }

    const prestamos = this.prestamos();
    const activos = prestamos.filter((p) => p.estado === 'activo').length;
    const pagados = prestamos.filter((p) => p.estado === 'pagado').length;
    const vencidos = prestamos.filter((p) => p.estado === 'vencido').length;

    this.chartPastel = new Chart(this.graficoPastelRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Activos', 'Pagados', 'Vencidos'],
        datasets: [
          {
            data: [activos, pagados, vencidos],
            backgroundColor: ['#4CAF50', '#2196F3', '#F44336'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  agruparPorMes(prestamos: Prestamo[]): Map<string, number> {
    const grupos = new Map<string, number>();

    prestamos.forEach((prestamo) => {
      const fecha = prestamo.fechaPrestamo;
      const mesAno = fecha.toLocaleDateString('es-CO', {
        month: 'short',
        year: 'numeric',
      });

      const actual = grupos.get(mesAno) || 0;
      grupos.set(mesAno, actual + 1);
    });

    return grupos;
  }
}
