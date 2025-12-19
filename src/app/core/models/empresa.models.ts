export interface Empresa {
  id_empresa: number;
  nombre: string;
  nit: string;
  direccion?: string | null;
  ciudad?: string | null;
  departamento?: string | null;
  telefono?: string | null;
  email?: string | null;
  representante_legal?: string | null;
  sector?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmpresaUpdate {
  nombre?: string;
  nit?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  telefono?: string;
  email?: string;
  representante_legal?: string;
  sector?: string;
}
