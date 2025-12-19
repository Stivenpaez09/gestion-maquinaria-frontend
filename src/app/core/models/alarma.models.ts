export type NivelAlarma = 'baja' | 'media' | 'alta' | 'crítica';

export interface Alarma {
  id_alarma: number;
  maquina: number;
  descripcion?: string | null;
  tipo: string;
  nivel: NivelAlarma;
  fecha_registro: string;
  vista: boolean;
  created_at: string;
  updated_at: string;
}
