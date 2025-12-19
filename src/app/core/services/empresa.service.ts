import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Empresa, EmpresaUpdate } from '../models/empresa.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.empresas}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                     LISTAR (GET)
  // -------------------------------------------------------
  listarEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl);
  }

  // -------------------------------------------------------
  //                   OBTENER (GET/{id})
  // -------------------------------------------------------
  obtenerEmpresa(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}${id}/`);
  }

  // -------------------------------------------------------
  //                      CREAR (POST)
  // -------------------------------------------------------
  crearEmpresa(data: EmpresaUpdate): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, data);
  }

  // -------------------------------------------------------
  //                 ACTUALIZAR (PATCH)
  // -------------------------------------------------------
  actualizarEmpresa(id: number, data: EmpresaUpdate): Observable<Empresa> {
    return this.http.patch<Empresa>(`${this.apiUrl}${id}/`, data);
  }

  // -------------------------------------------------------
  //                   ELIMINAR (DELETE)
  // -------------------------------------------------------
  eliminarEmpresa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
