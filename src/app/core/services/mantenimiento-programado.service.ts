import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import {
  MantenimientoProgramado,
  MantenimientoProgramadoCreate,
} from '../models/mantenimiento-programado.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MantenimientoProgramadoService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.mantenimientosProgramados}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                     LISTAR (GET)
  // -------------------------------------------------------
  listar(): Observable<MantenimientoProgramado[]> {
    return this.http.get<MantenimientoProgramado[]>(this.apiUrl);
  }

  // -------------------------------------------------------
  //                   OBTENER (GET/{id})
  // -------------------------------------------------------
  obtenerPorId(id: number): Observable<MantenimientoProgramado> {
    return this.http.get<MantenimientoProgramado>(`${this.apiUrl}${id}/`);
  }

  // -------------------------------------------------------
  //                     CREAR (POST)
  // -------------------------------------------------------
  crear(data: MantenimientoProgramadoCreate): Observable<MantenimientoProgramado> {
    return this.http.post<MantenimientoProgramado>(this.apiUrl, data);
  }

  // -------------------------------------------------------
  //                 ACTUALIZAR (PATCH)
  // -------------------------------------------------------
  actualizar(
    id: number,
    data: Partial<MantenimientoProgramadoCreate>
  ): Observable<MantenimientoProgramado> {
    return this.http.patch<MantenimientoProgramado>(`${this.apiUrl}${id}/`, data);
  }

  // -------------------------------------------------------
  //                   ELIMINAR (DELETE)
  // -------------------------------------------------------
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // -------------------------------------------------------
  //       OBTENER MANTENIMIENTOS DE UNA MÁQUINA (GET)
  // -------------------------------------------------------
  obtenerPorMaquina(id_maquina: number): Observable<MantenimientoProgramado[]> {
    return this.http.get<MantenimientoProgramado[]>(`${this.apiUrl}maquina/${id_maquina}/`);
  }
}
