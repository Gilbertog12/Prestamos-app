import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reporte-clientes',
  imports: [CommonModule, MatCardModule],
  templateUrl: './reporte-clientes.component.html',
  styleUrl: './reporte-clientes.component.scss',
})
export class ReporteClientesComponent {}
