export interface Curso {
  id_curso: number;
  usuario: number;
  nombre_curso: string;
  institucion: string;
  fecha_inicio: string;
  fecha_fin: string;
  created_at: string;
  updated_at: string;
}

export interface CursoCreate {
  usuario: number;
  nombre_curso: string;
  institucion: string;
  fecha_inicio: string;
  fecha_fin: string;
}
