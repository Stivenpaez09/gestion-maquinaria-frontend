import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alarma } from '../models/alarma.models';

@Injectable({
  providedIn: 'root',
})
export class AlarmaService {
  private baseUrl = `${environment.apiUrl}${environment.endpoints.alarmas}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                      LISTAR
  // -------------------------------------------------------
  getAlarmas(): Observable<Alarma[]> {
    return this.http.get<Alarma[]>(this.baseUrl);
  }

  // -------------------------------------------------------
  //                      OBTENER
  // -------------------------------------------------------
  getAlarmaById(id: number): Observable<Alarma> {
    return this.http.get<Alarma>(`${this.baseUrl}${id}/`);
  }

  // -------------------------------------------------------
  //                MARCAR COMO VISTA (PATCH)
  // -------------------------------------------------------
  marcarComoVista(id: number): Observable<Alarma> {
    return this.http.patch<Alarma>(`${this.baseUrl}${id}/marcar-vista/`, {});
  }

  // -------------------------------------------------------
  //             CANTIDAD NO VISTAS
  // -------------------------------------------------------
  getCantidadNoVistas(): Observable<{ cantidad_no_vistas: number }> {
    return this.http.get<{ cantidad_no_vistas: number }>(`${this.baseUrl}no-vistas/`);
  }
}
