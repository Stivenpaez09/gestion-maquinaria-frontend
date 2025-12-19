import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Mantenimiento, MantenimientoCreate } from '../models/mantenimiento-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MantenimientoService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.mantenimientos}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                     LISTAR (GET)
  // -------------------------------------------------------
  listar(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.apiUrl);
  }

  // -------------------------------------------------------
  //                  OBTENER (GET/{id})
  // -------------------------------------------------------
  obtenerPorId(id: number): Observable<Mantenimiento> {
    return this.http.get<Mantenimiento>(`${this.apiUrl}${id}/`);
  }

  // -------------------------------------------------------
  //               CONVERTIR A FORMDATA
  // -------------------------------------------------------
  private buildFormData(data: Partial<MantenimientoCreate>): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (typeof value === 'string' && value.trim() === '') return;

      formData.append(key, value as any);
    });

    return formData;
  }

  // -------------------------------------------------------
  //                     CREAR (POST)
  // -------------------------------------------------------
  crear(data: MantenimientoCreate): Observable<Mantenimiento> {
    const formData = this.buildFormData(data);
    return this.http.post<Mantenimiento>(this.apiUrl, formData);
  }

  // -------------------------------------------------------
  //                 ACTUALIZAR (PATCH)
  // -------------------------------------------------------
  actualizar(id: number, data: Partial<MantenimientoCreate>): Observable<Mantenimiento> {
    const formData = this.buildFormData(data);
    return this.http.patch<Mantenimiento>(`${this.apiUrl}${id}/`, formData);
  }

  // -------------------------------------------------------
  //                  ELIMINAR (DELETE)
  // -------------------------------------------------------
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // -------------------------------------------------------
  //       LISTAR POR MÁQUINA (GET /maquina/{id})
  // -------------------------------------------------------
  obtenerPorMaquina(id_maquina: number): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.apiUrl}maquina/${id_maquina}/`);
  }

  // -------------------------------------------------------
  //       LISTAR POR USUARIO (GET /usuario/{id})
  // -------------------------------------------------------
  obtenerPorUsuario(id_usuario: number): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.apiUrl}usuario/${id_usuario}/`);
  }
}
