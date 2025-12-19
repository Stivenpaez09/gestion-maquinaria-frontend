import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso, CursoCreate } from '../models/curso.models';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.cursos}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                     LISTAR (GET)
  // -------------------------------------------------------
  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  // -------------------------------------------------------
  //                 OBTENER POR ID (GET/{id})
  // -------------------------------------------------------
  obtener(idCurso: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}${idCurso}/`);
  }

  // -------------------------------------------------------
  //                     CREAR (POST)
  // -------------------------------------------------------
  crear(data: CursoCreate): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, data);
  }

  // -------------------------------------------------------
  //               ACTUALIZAR PARCIAL (PATCH/{id})
  // -------------------------------------------------------
  actualizar(idCurso: number, data: Partial<CursoCreate>): Observable<Curso> {
    return this.http.patch<Curso>(`${this.apiUrl}${idCurso}/`, data);
  }

  // -------------------------------------------------------
  //                     ELIMINAR (DELETE/{id})
  // -------------------------------------------------------
  eliminar(idCurso: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${idCurso}/`);
  }

  // -------------------------------------------------------
  //         CURSOS POR USUARIO (GET /usuario/{id})
  // -------------------------------------------------------
  listarPorUsuario(idUsuario: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}usuario/${idUsuario}/`);
  }
}
