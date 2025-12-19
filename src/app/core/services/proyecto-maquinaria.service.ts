import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProyectoMaquinaria, ProyectoMaquinariaCreate } from '../models/proyecto-maquinaria.models';

@Injectable({
  providedIn: 'root',
})
export class ProyectoMaquinariaService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.proyectoMaquinaria}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------------
  //                    LISTAR TODOS (GET)
  // -------------------------------------------------------------
  listar(): Observable<ProyectoMaquinaria[]> {
    return this.http.get<ProyectoMaquinaria[]>(this.apiUrl);
  }

  // -------------------------------------------------------------
  //                 OBTENER POR ID (GET/{id})
  // -------------------------------------------------------------
  obtener(id: number): Observable<ProyectoMaquinaria> {
    return this.http.get<ProyectoMaquinaria>(`${this.apiUrl}${id}/`);
  }

  // -------------------------------------------------------------
  //                      CREAR (POST)
  // -------------------------------------------------------------
  crear(data: ProyectoMaquinariaCreate): Observable<ProyectoMaquinaria> {
    return this.http.post<ProyectoMaquinaria>(this.apiUrl, data);
  }

  // -------------------------------------------------------------
  //                 ACTUALIZAR PARCIAL (PATCH/{id})
  // -------------------------------------------------------------
  actualizar(id: number, data: Partial<ProyectoMaquinariaCreate>): Observable<ProyectoMaquinaria> {
    return this.http.patch<ProyectoMaquinaria>(`${this.apiUrl}${id}/`, data);
  }

  // -------------------------------------------------------------
  //                      ELIMINAR (DELETE/{id})
  // -------------------------------------------------------------
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // -------------------------------------------------------------
  //       LISTAR ASIGNACIONES POR PROYECTO (GET /proyecto/{id})
  // -------------------------------------------------------------
  listarPorProyecto(idProyecto: number): Observable<ProyectoMaquinaria[]> {
    return this.http.get<ProyectoMaquinaria[]>(`${this.apiUrl}proyecto/${idProyecto}/`);
  }

  // -------------------------------------------------------------
  //       LISTAR ASIGNACIONES POR MÁQUINA (GET /maquina/{id})
  // -------------------------------------------------------------
  listarPorMaquina(idMaquina: number): Observable<ProyectoMaquinaria[]> {
    return this.http.get<ProyectoMaquinaria[]>(`${this.apiUrl}maquina/${idMaquina}/`);
  }
}
