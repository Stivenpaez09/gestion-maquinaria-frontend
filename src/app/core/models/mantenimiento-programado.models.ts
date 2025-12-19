export interface MantenimientoProgramado {
  id_programado: number;
  maquina: number;
  nombre: string;
  tipo: 'preventivo' | 'predictivo';
  intervalo_horas: number;
  descripcion?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MantenimientoProgramadoCreate {
  maquina: number;
  nombre: string;
  tipo: 'preventivo' | 'predictivo';
  intervalo_horas: number;
  descripcion?: string | null;
}
