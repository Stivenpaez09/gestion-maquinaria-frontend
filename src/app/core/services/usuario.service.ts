import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.usuarios}/`;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  //                      LISTAR (GET)
  // -------------------------------------------------------
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  // -------------------------------------------------------
  //                     OBTENER (GET/{id})
  // -------------------------------------------------------
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}${id}/`);
  }

  // -------------------------------------------------------
  //                     CREAR (POST)
  // -------------------------------------------------------
  createUsuario(data: any): Observable<Usuario> {
    const formData = new FormData();

    formData.append('nombre', data.nombre);
    formData.append('cargo', data.cargo);
    formData.append('email', data.email);
    formData.append('telefono', data.telefono);
    formData.append('fecha_ingreso', data.fecha_ingreso);

    if (data.foto instanceof File) {
      formData.append('foto', data.foto);
    }

    return this.http.post<Usuario>(this.baseUrl, formData);
  }

  // -------------------------------------------------------
  //                ACTUALIZAR (PATCH con form-data)
  // -------------------------------------------------------
  patchUsuario(id: number, data: any): Observable<Usuario> {
    const formData = new FormData();

    // Solo los campos que sí se pueden actualizar en el backend:
    if (data.nombre !== undefined) {
      formData.append('nombre', data.nombre);
    }

    if (data.cargo !== undefined) {
      formData.append('cargo', data.cargo);
    }

    if (data.email !== undefined) {
      formData.append('email', data.email);
    }

    if (data.telefono !== undefined) {
      formData.append('telefono', data.telefono);
    }

    if (data.fecha_ingreso !== undefined) {
      formData.append('fecha_ingreso', data.fecha_ingreso);
    }

    // Foto opcional
    if (data.foto instanceof File) {
      formData.append('foto', data.foto);
    }

    return this.http.patch<Usuario>(`${this.baseUrl}${id}/`, formData);
  }

  // -------------------------------------------------------
  //                     ELIMINAR (DELETE)
  // -------------------------------------------------------
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}
