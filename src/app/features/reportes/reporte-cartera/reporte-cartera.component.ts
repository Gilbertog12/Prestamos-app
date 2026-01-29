import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reporte-cartera',
  imports: [CommonModule, MatCardModule],
  templateUrl: './reporte-cartera.component.html',
  styleUrl: './reporte-cartera.component.scss',
})
export class ReporteCarteraComponent {}
