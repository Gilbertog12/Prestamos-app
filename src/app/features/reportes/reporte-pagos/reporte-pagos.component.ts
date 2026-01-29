import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reporte-pagos',
  imports: [CommonModule, MatCardModule],
  templateUrl: './reporte-pagos.component.html',
  styleUrl: './reporte-pagos.component.scss',
})
export class ReportePagosComponent {
  @Input() fechaDesde!: Date;
  @Input() fechaHasta!: Date;
}
