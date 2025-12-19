export interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  empresa: number | null;
  descripcion?: string | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProyectoUpdate {
  nombre_proyecto?: string;
  empresa?: number | null;
  descripcion?: string | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
}
