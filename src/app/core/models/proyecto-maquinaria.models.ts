export interface ProyectoMaquinaria {
  id_proyecto_maquinaria: number;

  proyecto: number;
  maquina: number;

  fecha_asignacion: string;
  horas_totales: number;
  horas_acumuladas: number;
  finalizado: boolean;

  created_at: string;
  updated_at: string;
}

export interface ProyectoMaquinariaCreate {
  proyecto: number;
  maquina: number;

  horas_totales: number;

  finalizado?: boolean;
}
