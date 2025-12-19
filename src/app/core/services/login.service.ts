import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login, LoginCreate } from '../models/login.models';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.logins}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                     LISTAR (GET)
  // -------------------------------------------------------
  listar(): Observable<Login[]> {
    return this.http.get<Login[]>(this.apiUrl);
  }

  // -------------------------------------------------------
  //                 OBTENER POR ID (GET/{id})
  // -------------------------------------------------------
  obtener(idLogin: number): Observable<Login> {
    return this.http.get<Login>(`${this.apiUrl}${idLogin}/`);
  }

  // -------------------------------------------------------
  //         OBTENER LOGIN POR USUARIO (GET)
  // -------------------------------------------------------
  obtenerPorUsuario(usuarioId: number): Observable<Login> {
    return this.http.get<Login>(`${this.apiUrl}por-usuario/${usuarioId}/`);
  }

  // -------------------------------------------------------
  //                     CREAR (POST)
  // -------------------------------------------------------
  crear(data: LoginCreate): Observable<Login> {
    return this.http.post<Login>(this.apiUrl, data);
  }

  // -------------------------------------------------------
  //               ACTUALIZAR PARCIAL (PATCH/{id})
  // -------------------------------------------------------
  actualizar(idLogin: number, data: Partial<LoginCreate>): Observable<Login> {
    return this.http.patch<Login>(`${this.apiUrl}${idLogin}/`, data);
  }

  // -------------------------------------------------------
  //                     ELIMINAR (DELETE/{id})
  // -------------------------------------------------------
  eliminar(idLogin: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${idLogin}/`);
  }
}
