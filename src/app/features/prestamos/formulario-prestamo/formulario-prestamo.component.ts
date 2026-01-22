import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ClientesService } from '../../../core/services/clientes.service';
import { PrestamosService } from '../../../core/services/prestamos.service';
import {
  calcularPrestamo,
  formatearMoneda,
} from '../../../core/utils/calculos-prestamo';
import { cliente } from '../../../core/models/clientes.interface';
import { MatCardModule } from '@angular/material/card';
import {
  MatFormField,
  MatLabel,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-formulario-prestamo',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatLabel,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './formulario-prestamo.component.html',
  styleUrl: './formulario-prestamo.component.scss',
})
export class FormularioPrestamoComponent {
  private fb = inject(FormBuilder);
  private prestamosService = inject(PrestamosService);
  private clientesService = inject(ClientesService);
  private router = inject(Router);

  // Signals
  clientes = signal<cliente[]>([]);
  loading = signal(false);
  calculoActual = signal<any>(null);

  // Formulario
  prestamoForm: FormGroup;

  constructor() {
    this.prestamoForm = this.fb.group({
      clienteId: ['', Validators.required],
      capital: [0, [Validators.required, Validators.min(10000)]],
      tasaPorcentaje: [
        0,
        [Validators.required, Validators.min(0.1), Validators.max(20)],
      ],
      plazoMeses: [
        1,
        [Validators.required, Validators.min(1), Validators.max(60)],
      ],
      numeroCuotas: [1, [Validators.required, Validators.min(1)]],
    });

    // Recalcular automáticamente cuando cambien los valores
    this.prestamoForm.valueChanges.subscribe(() => {
      this.calcularValores();
    });
  }

  async ngOnInit() {
    // Cargar lista de clientes
    const clientesData = await this.clientesService.obtenerclientes();
    this.clientes.set(clientesData.filter((c: cliente) => c.activo));
  }

  calcularValores() {
    const form = this.prestamoForm.value;

    if (
      form.capital > 0 &&
      form.tasaPorcentaje > 0 &&
      form.plazoMeses > 0 &&
      form.numeroCuotas > 0
    ) {
      const calculo = calcularPrestamo(
        form.capital,
        form.tasaPorcentaje,
        form.plazoMeses,
        form.numeroCuotas,
      );

      this.calculoActual.set(calculo);
    }
  }

  async onSubmit() {
    if (this.prestamoForm.invalid) {
      Object.keys(this.prestamoForm.controls).forEach((key) => {
        this.prestamoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);

    const resultado = await this.prestamosService.crear(
      this.prestamoForm.value,
    );

    this.loading.set(false);

    if (resultado.success) {
      this.router.navigate(['/prestamos']);
    } else {
      alert('Error: ' + resultado.error);
    }
  }

  formatearMoneda(calculo: number): string {
    return formatearMoneda(calculo);
  }

  cancelar() {
    this.router.navigate(['/prestamos']);
  }
}
