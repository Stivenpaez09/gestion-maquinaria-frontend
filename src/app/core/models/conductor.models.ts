export interface Conductor {
  id_conductor: number;
  usuario: number;
  licencia: string;
  fecha_vencimiento: string;
  licencia_vencida: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConductorCreate {
  usuario: number;
  licencia: string;
  fecha_vencimiento: string;
  licencia_vencida: boolean;
}
