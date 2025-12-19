export interface Usuario {
  id_usuario: number;
  nombre: string;
  cargo: string;
  email: string;
  telefono: string | null;
  fecha_ingreso: string | null;
  foto: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  usuario: Usuario;
  token: string;
}

export interface TokenDecoded {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  login_id: string;
  rol: string;
  username: string;
}

export enum LoginRol {
  ADMIN = 'ADMIN',
  RESPONSABLE = 'RESPONSABLE_DE_MANTENIMIENTO',
  TECNICO = 'TECNICO_DE_MANTENIMIENTO',
  OPERADOR = 'OPERADOR',
}
