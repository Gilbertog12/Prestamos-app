import { Component, inject, signal } from '@angular/core';
import { ClientesService } from '../../../core/services/clientes.service';
import { Router } from '@angular/router';
import { cliente } from '../../../core/models/clientes.interface';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-lista-clientes',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './lista-clientes.component.html',
  styleUrl: './lista-clientes.component.scss',
})
export class ListaClientesComponent {
  private clienteService = inject(ClientesService);
  private router = inject(Router);

  displayedColumns = [
    'nombre',
    'cedula',
    'telefono',
    'email',
    'activo',
    'acciones',
  ];

  loading = this.clienteService.loading;
  clientes = this.clienteService.clientes;

  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    await this.clienteService.obtenerclientes();
  }

  nuevoCliente() {
    this.router.navigate(['/clientes/nuevo']);
  }

  editarCliente(cliente: cliente) {
    // TODO: Navegar a formulario de edición

    this.router.navigate(['/clientes/editar', cliente.id]);
  }

  async eliminarCliente(cliente: cliente) {
    // Confirmación
    const confirmado = confirm(
      `¿Seguro que deseas eliminar a ${cliente.nombre}?\n\nEsta acción no se puede deshacer.`,
    );

    if (!confirmado) return;

    // Eliminar
    const resultado = await this.clienteService.eliminar(cliente.id);

    // Verificar resultado
    if (resultado.success) {
      // Recargar lista
      await this.clienteService.obtenerclientes();
    } else {
      // Mostrar error
      alert('Error eliminando cliente: ' + resultado.error);
    }
  }
}
