export type EstadoMaquinaria = 'operativa' | 'en mantenimiento' | 'fuera de servicio';

export interface Maquinaria {
  id_maquina: number;
  nombre_maquina: string;
  modelo: string | null;
  marca: string | null;
  serie: string | null;
  fecha_adquisicion: string | null;
  horas_totales: number;
  estado: EstadoMaquinaria;
  foto: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaquinariaCreate {
  nombre_maquina: '';
  modelo: '';
  marca: '';
  serie: '';
  fecha_adquisicion: '';
  horas_totales: 0;
  estado: 'operativa';
  foto: null;
}

export interface MaquinariaUpdate {
  nombre_maquina?: string;
  modelo?: string | null;
  marca?: string | null;
  serie?: string | null;
  fecha_adquisicion?: string | null;
  horas_totales?: number;
  estado?: 'operativa' | 'en mantenimiento' | 'fuera de servicio';
  foto?: string | null;
}

export interface MaquinariaResumen {
  en_operacion: number;
  al_dia: number;
  pendientes: number;
  vencidos: number;
}
