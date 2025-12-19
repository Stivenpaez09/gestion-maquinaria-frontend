export interface Usuario {
  id_usuario: number;
  nombre: string;
  cargo: string;
  email?: string | null;
  telefono?: string | null;
  fecha_ingreso?: string | null;
  foto?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsuarioCreate {
  nombre?: string;
  cargo?: string;
  email?: string | null;
  telefono?: string | null;
  fecha_ingreso?: string | null;
  foto?: string | null;
}
