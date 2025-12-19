import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Conductor, ConductorCreate } from '../models/conductor.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConductorService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.conductores}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                     LISTAR (GET)
  // -------------------------------------------------------
  listar(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>(this.apiUrl);
  }

  // -------------------------------------------------------
  //                 OBTENER POR ID (GET/{id})
  // -------------------------------------------------------
  obtener(idConductor: number): Observable<Conductor> {
    return this.http.get<Conductor>(`${this.apiUrl}${idConductor}/`);
  }

  // -------------------------------------------------------
  //                     CREAR (POST)
  // -------------------------------------------------------
  crear(data: ConductorCreate): Observable<Conductor> {
    return this.http.post<Conductor>(this.apiUrl, data);
  }

  // -------------------------------------------------------
  //               ACTUALIZAR PARCIAL (PATCH/{id})
  // -------------------------------------------------------
  actualizar(idConductor: number, data: Partial<ConductorCreate>): Observable<Conductor> {
    return this.http.patch<Conductor>(`${this.apiUrl}${idConductor}/`, data);
  }

  // -------------------------------------------------------
  //                     ELIMINAR (DELETE/{id})
  // -------------------------------------------------------
  eliminar(idConductor: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${idConductor}/`);
  }
}
