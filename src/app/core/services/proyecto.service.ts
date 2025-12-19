import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Proyecto } from '../models/proyecto.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.proyectos}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                      LISTAR (GET)
  // -------------------------------------------------------
  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.baseUrl);
  }

  // -------------------------------------------------------
  //                   OBTENER (GET/{id})
  // -------------------------------------------------------
  getProyectoById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.baseUrl}${id}/`);
  }

  // -------------------------------------------------------
  //                     CREAR (POST)
  // -------------------------------------------------------
  createProyecto(data: any): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.baseUrl, data);
  }

  // -------------------------------------------------------
  //                 ACTUALIZAR (PATCH, JSON)
  // -------------------------------------------------------
  patchProyecto(id: number, data: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.patch<Proyecto>(`${this.baseUrl}${id}/`, data);
  }

  // -------------------------------------------------------
  //                     ELIMINAR (DELETE)
  // -------------------------------------------------------
  deleteProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  // -------------------------------------------------------
  //     LISTAR PROYECTOS POR EMPRESA (GET por-empresa)
  // -------------------------------------------------------
  getProyectosPorEmpresa(idEmpresa: number): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.baseUrl}por-empresa/${idEmpresa}/`);
  }
}
