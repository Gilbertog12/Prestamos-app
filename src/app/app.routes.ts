import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponentComponent } from './features/auth/register-component/register-component.component';
import { ListaClientesComponent } from './features/clientes/lista-clientes/lista-clientes.component';
import { FormularioClienteComponent } from './features/clientes/formulario-cliente/formulario-cliente.component';
import { FormularioPrestamoComponent } from './features/prestamos/formulario-prestamo/formulario-prestamo.component';
import { ListaPrestamosComponent } from './features/prestamos/lista-prestamos/lista-prestamos.component';
import { FormularioPagoComponent } from './features/pagos/formulario-pago/formulario-pago.component';
import { DetallePrestamoComponent } from './features/prestamos/detalle-prestamo/detalle-prestamo.component';
import { ReportesComponent } from './features/reportes/reportes/reportes.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponentComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clientes',
    component: ListaClientesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clientes/nuevo',
    component: FormularioClienteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clientes/editar/:id',
    component: FormularioClienteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'prestamos',
    component: ListaPrestamosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'prestamos/nuevo',
    component: FormularioPrestamoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'prestamos/:prestamoId/pago',
    component: FormularioPagoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'prestamos/:id',
    component: DetallePrestamoComponent,
    canActivate: [authGuard],
  },

  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
