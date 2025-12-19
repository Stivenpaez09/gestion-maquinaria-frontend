import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { HojaVida } from '../models/hoja_vida.models';
import { Observable } from 'rxjs';
import { Maquinaria, MaquinariaUpdate } from '../models/maquinaria.models';

@Injectable({
  providedIn: 'root',
})
export class HojaVidaService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.hojasVida}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                      LISTAR (GET)
  // -------------------------------------------------------
  getHojasVida(): Observable<HojaVida[]> {
    return this.http.get<HojaVida[]>(this.baseUrl);
  }

  // -------------------------------------------------------
  //           OBTENER POR MAQUINARIA (GET/{id})
  // -------------------------------------------------------
  getHojasVidaByMaquinaria(id_maquina: number): Observable<HojaVida[]> {
    return this.http.get<HojaVida[]>(`${this.baseUrl}?maquinaria=${id_maquina}`);
  }

  // -------------------------------------------------------
  //                      OBTENER (GET/{id})
  // -------------------------------------------------------
  getHojaVidaById(id: number): Observable<HojaVida> {
    return this.http.get<HojaVida>(`${this.baseUrl}${id}/`);
  }

  // -------------------------------------------------------
  //                   CREAR CON FORMDATA (POST)
  // -------------------------------------------------------
  createHojaVidaFormData(formData: FormData): Observable<HojaVida> {
    return this.http.post<HojaVida>(this.baseUrl, formData);
  }

  // -------------------------------------------------------
  //                   CREAR (POST)
  // -------------------------------------------------------
  createHojaVida(data: Partial<HojaVida>): Observable<HojaVida> {
    return this.http.post<HojaVida>(this.baseUrl, data);
  }

  // -------------------------------------------------------
  //                  ACTUALIZAR CON FORMDATA (PATCH)
  // -------------------------------------------------------
  patchHojaVidaFormData(id: number, formData: FormData): Observable<HojaVida> {
    return this.http.patch<HojaVida>(`${this.baseUrl}${id}/`, formData);
  }

  // -------------------------------------------------------
  //               ACTUALIZAR CON PATCH (PATCH)
  // -------------------------------------------------------
  patchMaquinaria(id: number, data: Partial<MaquinariaUpdate>): Observable<Maquinaria> {
    return this.http.patch<Maquinaria>(`${this.baseUrl}${id}/`, data);
  }

  // -------------------------------------------------------
  //                      ELIMINAR (DELETE)
  // -------------------------------------------------------
  deleteHojaVida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}
