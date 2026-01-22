export interface cliente {
  id: string;
  nombre: string;
  cedula: string;
  email?: string;
  telefono?: string;
  activo: boolean;
  createdAt: Date;
}
