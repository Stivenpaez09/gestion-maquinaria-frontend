export interface Mantenimiento {
  id_mantenimiento: number;
  maquina: number;
  programado?: number | null;
  usuario?: number | null;
  tipo_mantenimiento: 'preventivo' | 'correctivo' | 'predictivo';
  descripcion: string;
  fecha_mantenimiento: string;
  horas_realizadas: number;
  costo: number;
  foto?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MantenimientoCreate {
  maquina: number;
  programado: number | null;
  usuario: number | null;
  tipo_mantenimiento: 'preventivo' | 'correctivo' | 'predictivo';
  descripcion: string;
  fecha_mantenimiento: string;
  horas_realizadas: number;
  costo: number;
  foto?: string | null;
  created_at: string;
  updated_at: string;
}
