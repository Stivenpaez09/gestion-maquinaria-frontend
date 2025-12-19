import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Maquinaria,
  MaquinariaCreate,
  MaquinariaResumen,
  MaquinariaUpdate,
} from '../models/maquinaria.models';

@Injectable({
  providedIn: 'root',
})
export class MaquinariaService {
  private baseUrl = `${environment.apiUrl}${environment.endpoints.maquinarias}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                      LISTAR
  // -------------------------------------------------------
  getMaquinarias(): Observable<Maquinaria[]> {
    return this.http.get<Maquinaria[]>(this.baseUrl);
  }

  // -------------------------------------------------------
  //                      OBTENER
  // -------------------------------------------------------
  getMaquinariaById(id: number): Observable<Maquinaria> {
    return this.http.get<Maquinaria>(`${this.baseUrl}${id}/`);
  }

  // -------------------------------------------------------
  //              CREAR CON FORMDATA
  // -------------------------------------------------------
  createMaquinariaFormData(formData: FormData): Observable<Maquinaria> {
    return this.http.post<Maquinaria>(this.baseUrl, formData);
  }

  // -------------------------------------------------------
  //                      ACTUALIZAR
  // -------------------------------------------------------
  updateMaquinaria(id: number, data: MaquinariaUpdate): Observable<Maquinaria> {
    return this.http.put<Maquinaria>(`${this.baseUrl}${id}/`, data);
  }

  // -------------------------------------------------------
  //              ACTUALIZAR CON PATCH (FORMDATA)
  // -------------------------------------------------------
  patchMaquinaria(id: number, data: Partial<MaquinariaUpdate>): Observable<Maquinaria> {
    const formData = new FormData();

    // Agregar solo los campos que vienen en data (no null/undefined)
    if (data.nombre_maquina !== undefined) {
      formData.append('nombre_maquina', data.nombre_maquina);
    }
    if (data.modelo !== undefined) {
      formData.append('modelo', data.modelo || '');
    }
    if (data.marca !== undefined) {
      formData.append('marca', data.marca || '');
    }
    if (data.serie !== undefined) {
      formData.append('serie', data.serie || '');
    }
    if (data.fecha_adquisicion !== undefined) {
      formData.append('fecha_adquisicion', data.fecha_adquisicion || '');
    }
    if (data.horas_totales !== undefined) {
      formData.append('horas_totales', String(data.horas_totales));
    }
    if (data.estado !== undefined) {
      formData.append('estado', data.estado);
    }

    return this.http.patch<Maquinaria>(`${this.baseUrl}${id}/`, formData);
  }

  // -------------------------------------------------------
  //                      ELIMINAR
  // -------------------------------------------------------
  deleteMaquinaria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  // -------------------------------------------------------
  //                      RESUMEN
  // -------------------------------------------------------
  getResumenMaquinarias(): Observable<MaquinariaResumen> {
    return this.http.get<{
      en_operacion: number;
      al_dia: number;
      pendientes: number;
      vencidos: number;
    }>(`${this.baseUrl}resumen/`);
  }

  // -------------------------------------------------------
  //          MAQUINARIAS EN OPERACIÓN
  // -------------------------------------------------------
  getMaquinariasEnOperacion(): Observable<Maquinaria[]> {
    return this.http.get<Maquinaria[]>(`${this.baseUrl}en-operacion/`);
  }

  // -------------------------------------------------------
  //          MAQUINARIAS VENCIDAS
  // -------------------------------------------------------
  getMaquinariasVencidas(): Observable<Maquinaria[]> {
    return this.http.get<Maquinaria[]>(`${this.baseUrl}vencidas/`);
  }

  // -------------------------------------------------------
  //          MAQUINARIAS PENDIENTES
  // -------------------------------------------------------
  getMaquinariasPendientes(): Observable<Maquinaria[]> {
    return this.http.get<Maquinaria[]>(`${this.baseUrl}pendientes/`);
  }

  // -------------------------------------------------------
  //          MAQUINARIAS AL DÍA
  // -------------------------------------------------------
  getMaquinariasAlDia(): Observable<Maquinaria[]> {
    return this.http.get<Maquinaria[]>(`${this.baseUrl}al-dia/`);
  }

  // -------------------------------------------------------
  //        ÚLTIMAS MAQUINARIAS
  // -------------------------------------------------------
  getUltimasMaquinarias(): Observable<Maquinaria[]> {
    return this.http.get<Maquinaria[]>(`${this.baseUrl}ultimas-maquinarias/`);
  }
}
