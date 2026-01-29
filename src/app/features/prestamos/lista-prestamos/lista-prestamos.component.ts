import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Prestamo } from '../../../core/models/prestamo.interface';
import { PrestamosService } from '../../../core/services/prestamos.service';
import { Router, RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { formatearMoneda } from '../../../core/utils/calculos-prestamo';

@Component({
  selector: 'app-lista-prestamos',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    RouterLink,
    MatChipsModule,
  ],
  templateUrl: './lista-prestamos.component.html',
  styleUrl: './lista-prestamos.component.scss',
})
export class ListaPrestamosComponent {
  private prestamoService = inject(PrestamosService);
  private router = inject(Router);

  displayedColumns = [
    'cliente',
    'capital',
    'tasaInteres',
    'totalAPagar',
    'saldoPendiente',
    'valorCuota',
    'estado',
    'fechaPrestamo',
    'acciones',
  ];

  loading = this.prestamoService.loading;
  prestamos = this.prestamoService.prestamos;

  formatearMoneda = formatearMoneda;

  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    await this.prestamoService.getAll();
  }

  nuevoPrestamo() {
    this.router.navigate(['prestamos/nuevo']);
  }

  async obtenerPrestamos() {
    const prestamos = await this.prestamoService.getAll();

    console.log(prestamos);
  }

  editarPrestamo(Prestamo: Prestamo) {
    //TODO pensar si implementar
  }

  async eliminarPrestamo(Prestamo: Prestamo) {
    const confirmar = confirm(
      `¿Seguro que deseas eliminar el prestamo a  ${Prestamo.clienteNombre} por ${Prestamo.totalAPagar}?\n\nEsta acción no se puede deshacer.`,
    );

    if (!confirmar) {
      return;
    }

    await this.prestamoService.eliminar(Prestamo.id);
  }
}
