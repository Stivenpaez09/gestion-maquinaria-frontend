import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import {
  RegistroHorasMaquinaria,
  RegistroHorasMaquinariaCreate,
} from '../models/registro-horas-maquinaria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistroHorasMaquinariaService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.registrosHorarios}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                     LISTAR (GET)
  // -------------------------------------------------------
  listar(): Observable<RegistroHorasMaquinaria[]> {
    return this.http.get<RegistroHorasMaquinaria[]>(this.apiUrl);
  }

  // -------------------------------------------------------
  //                OBTENER (GET/{id})
  // -------------------------------------------------------
  obtenerPorId(id: number): Observable<RegistroHorasMaquinaria> {
    return this.http.get<RegistroHorasMaquinaria>(`${this.apiUrl}${id}/`);
  }

  // -------------------------------------------------------
  //                CONVERTIR A FORMDATA
  // -------------------------------------------------------
  private buildFormData(data: Partial<RegistroHorasMaquinariaCreate>): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    return formData;
  }

  // -------------------------------------------------------
  //                     CREAR (POST)
  // -------------------------------------------------------
  crear(data: RegistroHorasMaquinariaCreate): Observable<RegistroHorasMaquinaria> {
    const formData = this.buildFormData(data);
    return this.http.post<RegistroHorasMaquinaria>(this.apiUrl, formData);
  }

  // -------------------------------------------------------
  //                     ACTUALIZAR (PATCH)
  // -------------------------------------------------------
  actualizar(
    id: number,
    data: Partial<RegistroHorasMaquinariaCreate>
  ): Observable<RegistroHorasMaquinaria> {
    const formData = this.buildFormData(data);
    return this.http.patch<RegistroHorasMaquinaria>(`${this.apiUrl}${id}/`, formData);
  }

  // -------------------------------------------------------
  //                     ELIMINAR (DELETE)
  // -------------------------------------------------------
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // -------------------------------------------------------
  //         LISTAR POR MÁQUINA (GET /maquina/{id})
  // -------------------------------------------------------
  obtenerPorMaquina(id_maquina: number): Observable<RegistroHorasMaquinaria[]> {
    return this.http.get<RegistroHorasMaquinaria[]>(`${this.apiUrl}maquina/${id_maquina}/`);
  }
}
