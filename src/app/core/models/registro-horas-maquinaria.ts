import { Maquinaria } from './maquinaria.models';
import { Proyecto } from './proyecto.models';

export interface RegistroHorasMaquinaria {
  id_registro: number;
  maquina: number;
  proyecto?: number | null;
  usuario?: number | null;
  fecha: string;
  horas_trabajadas: number;
  observaciones?: string | null;
  foto_planilla?: string | null;
  foto_horometro_inicial?: string | null;
  foto_horometro_final?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegistroHorasMaquinariaCreate {
  maquina: number;
  fecha: string;
  horas_trabajadas: number;
  proyecto: number | null;
  usuario: number | null;
  observaciones?: string | null;
  foto_planilla?: string | null;
  foto_horometro_inicial?: string | null;
  foto_horometro_final?: string | null;
}

export interface RegistroConDatos extends RegistroHorasMaquinaria {
  proyectoData?: Proyecto | null;
  maquinariaData?: Maquinaria | null;
}
