export interface HojaVida {
  id_hoja: number;
  maquinaria: number;
  usuario: number | null;
  descripcion: string | null;
  archivo: string | null;
  fecha_registro: string;
  created_at: string;
  updated_at: string;
}
