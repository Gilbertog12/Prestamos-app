import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../../core/services/clientes.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-formulario-cliente',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  templateUrl: './formulario-cliente.component.html',
  styleUrl: './formulario-cliente.component.scss',
})
export class FormularioClienteComponent {
  private fb = inject(FormBuilder);
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clienteForm: FormGroup;
  clienteId = signal<string | null>(null);
  loading = signal(false);
  esEdicion = signal(false);

  constructor() {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      cedula: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
        ],
      ],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.email]],
      direccion: [''],
      ciudad: [''],
      activo: [true],
    });
  }

  async ngOnInit() {
    // TODO: Verificar si es edición (tiene ID en la ruta)
    const id = this.route.snapshot.paramMap.get('id');

    // TODO: Si es edición, cargar datos del cliente
    if (id) {
      this.clienteId.set(id);
      this.esEdicion.set(true);

      await this.cargarCliente(id);
    }
  }

  async cargarCliente(id: string) {
    this.loading.set(true);

    // TODO: Obtener cliente del servicio
    const cliente = await this.clientesService.getById(id);

    if (cliente) {
      console.log(cliente);
      // TODO: Cargar datos en el formulario con patchValue
      this.clienteForm.patchValue({
        nombre: cliente.nombre,
        cedula: cliente.cedula,
        telefono: cliente.telefono,
        email: cliente.email,
        activo: cliente.activo,
      });
    }

    this.loading.set(false);
  }

  async onSubmit() {
    // TODO: Validar formulario
    if (this.clienteForm.invalid) {
      Object.keys(this.clienteForm.controls).forEach((key) => {
        this.clienteForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);

    const datosCliente = this.clienteForm.value;

    console.log(datosCliente);
    let resultado;
    // TODO: Si es edición, actualizar; si no, crear
    if (this.esEdicion()) {
      resultado = this.clientesService.actualizar(
        this.clienteId()!,
        datosCliente,
      );
    } else {
      resultado = await this.clientesService.crearCliente(datosCliente);
      this.router.navigate(['/clientes']);
    }
    // TODO: Navegar a lista después de guardar
    // console.log(resultado);
  }

  cancelar() {
    // TODO: Volver a la lista
    this.router.navigate(['/clientes']);
  }
}
