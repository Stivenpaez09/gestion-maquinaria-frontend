export interface Login {
  id_login: number;
  username: string;
  rol: 'ADMIN' | 'RESPONSABLE_DE_MANTENIMIENTO' | 'OPERADOR' | 'TECNICO_DE_MANTENIMIENTO';
  is_active: boolean;
  usuario: number;
}

export interface LoginCreate {
  usuario: number;
  username: string;
  password: string;
  rol: 'ADMIN' | 'RESPONSABLE_DE_MANTENIMIENTO' | 'OPERADOR' | 'TECNICO_DE_MANTENIMIENTO';
  is_active?: boolean;
}
