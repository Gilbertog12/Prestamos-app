import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Prestamo } from '../../../core/models/prestamo.interface';
import { PagosService } from '../../../core/services/pagos.service';

@Component({
  selector: 'app-formulario-pago',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './formulario-pago.component.html',
  styleUrl: './formulario-pago.component.scss',
})
export class FormularioPagoComponent {
  prestamo = signal<Prestamo | null>(null);
  loading = signal(false);

  formatearMoneda = formatearMoneda;

  private fb = inject(FormBuilder);
  private pagosService = inject(PagosService);
  private prestamosService = inject(PrestamosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  pagoForm: FormGroup;

  constructor() {
    this.pagoForm = this.fb.group({
      monto: [0, [Validators.required, Validators.min(1)]],
      metodoPago: ['', Validators.required],
      observaciones: [''],
    });
  }
  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const prestamoId = this.route.snapshot.paramMap.get('prestamoId');

    if (prestamoId) {
      const prestamoData = await this.prestamosService.getById(prestamoId);
      this.prestamo.set(prestamoData);

      // Si el préstamo existe, actualizar validación del monto
      if (prestamoData) {
        // TU CÓDIGO AQUÍ
        // Agrega el validador Validators.max(prestamoData.saldoPendiente)
        this.pagoForm
          .get('monto')
          ?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(prestamoData.saldoPendiente),
          ]);

        this.pagoForm.get('monto')?.updateValueAndValidity();
        // No olvides llamar updateValueAndValidity()
      }
    }
  }

  async onSubmit() {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    const prestamo = this.prestamo();
    if (!prestamo) return;
    this.loading.set(true);

    const resultado = await this.pagosService.registrarPago(
      prestamo.id,
      this.pagoForm.value,
    );

    this.loading.set(false);

    if (resultado.success) {
      this.router.navigate(['/prestamos']);
    } else {
      alert(resultado.error);
    }
  }

  cancelar() {
    const prestamo = this.prestamo();

    if (prestamo) {
      this.router.navigate(['/prestamos', prestamo.id]);
    } else {
      this.router.navigate(['/prestamos']);
    }
  }
}
