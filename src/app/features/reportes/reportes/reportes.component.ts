import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportePrestamosComponent } from '../reporte-prestamos/reporte-prestamos.component';
import { ReportePagosComponent } from '../reporte-pagos/reporte-pagos.component';
import { ReporteCarteraComponent } from '../reporte-cartera/reporte-cartera.component';
import { ReporteClientesComponent } from '../reporte-clientes/reporte-clientes.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    ReportePrestamosComponent,
    ReportePagosComponent,
    ReporteCarteraComponent,
    ReporteClientesComponent,
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss',
})
export class ReportesComponent {
  fechaDesde = signal<Date>(this.obtenerPrimerDiaMes());
  fechaHasta = signal<Date>(new Date());
  tabSeleccionado = 0;

  obtenerPrimerDiaMes(): Date {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  }

  onFechaChange() {
    // Trigger para actualizar componentes hijos si necesario
  }

  onTabChange(index: number) {
    this.tabSeleccionado = index;
  }

  generarReporte() {
    // Los componentes hijos reaccionarán a los cambios de fecha
    console.log('Generar reporte', this.fechaDesde(), this.fechaHasta());
  }
}
