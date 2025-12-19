import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { BehaviorSubject, interval, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, TokenDecoded, Usuario } from '../models/auth.models';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.logins}/login/`;
  private readonly tokenKey = 'auth_token';
  private readonly checkIntervalMs = 5 * 60 * 1000; // 5 minutos

  private readonly usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  readonly usuario$ = this.usuarioSubject.asObservable();

  private readonly tokenCheckInterval = interval(this.checkIntervalMs);

  constructor(
    private readonly http: HttpClient,
    private readonly cookies: CookieService,
    private message: MessageService
  ) {
    this.verificarTokenAlIniciar();
    this.iniciarRevisionAutomatica();
  }

  // -------------------------------------------------------
  // LOGIN
  // -------------------------------------------------------
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((response: LoginResponse) => {
        this.manejarLogin(response);
      })
    );
  }

  manejarLogin(response: LoginResponse) {
    this.guardarToken(response.token);
    localStorage.setItem('usuario', JSON.stringify(response.usuario));
    this.usuarioSubject.next(response.usuario);
  }

  // -------------------------------------------------------
  // COOKIES
  // -------------------------------------------------------
  private guardarToken(token: string) {
    const expires = new Date();
    expires.setHours(expires.getHours() + 6); // Igual al backend

    // Cookie segura para producción
    this.cookies.set(
      this.tokenKey,
      token,
      expires,
      '/',
      '',
      true, // secure: true en producción
      'Strict' // SameSite
    );
  }

  obtenerToken(): string | null {
    const token = this.cookies.get(this.tokenKey);
    return token || null;
  }

  borrarToken() {
    this.cookies.delete(this.tokenKey, '/');
  }

  // -------------------------------------------------------
  // DECODIFICAR TOKEN
  // -------------------------------------------------------
  decodificarToken(token: string): TokenDecoded | null {
    try {
      return jwtDecode<TokenDecoded>(token);
    } catch (e) {
      return null;
    }
  }

  // -------------------------------------------------------
  // VALIDAR EXPIRACIÓN
  // -------------------------------------------------------
  tokenExpirado(token: string): boolean {
    const decoded = this.decodificarToken(token);
    if (!decoded) return true;

    const ahora = Math.floor(Date.now() / 1000);
    return decoded.exp < ahora;
  }

  // -------------------------------------------------------
  // OBTENER ROL
  // -------------------------------------------------------
  obtenerRol(): string | null {
    const token = this.obtenerToken();
    if (!token) return null;

    const decoded = this.decodificarToken(token);
    return decoded?.rol || null;
  }

  obtenerUsername(): string | null {
    const token = this.obtenerToken();
    if (!token) return null;

    const decoded = this.decodificarToken(token);
    return decoded?.username || null;
  }

  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------
  logout() {
    this.borrarToken();
    localStorage.removeItem('usuario');
    localStorage.removeItem('auth_token');
    this.usuarioSubject.next(null);
  }

  // -------------------------------------------------------
  // REVISAR TOKEN CADA 5 MINUTOS
  // -------------------------------------------------------
  private iniciarRevisionAutomatica() {
    this.tokenCheckInterval.subscribe(() => {
      const token = this.obtenerToken();
      if (!token) return;

      if (this.tokenExpirado(token)) {
        this.message.showWarning('Token expirado. Cerrando sesión automáticamente...');
        this.logout();
      }
    });
  }

  // -------------------------------------------------------
  // ESTÁ AUTENTICADO
  // -------------------------------------------------------
  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    // Validar expiración
    if (this.tokenExpirado(token)) return false;

    return true;
  }

  // -------------------------------------------------------
  // Obtener usuario actual
  // -------------------------------------------------------
  obtenerUsuario(): Usuario | null {
    const token = this.obtenerToken();
    if (!token) return null;

    const decoded = this.decodificarToken(token);
    if (!decoded) return null;

    const usuarioActual = this.usuarioSubject.getValue();
    return usuarioActual;
  }

  obtenerNombreUsuario(): string | null {
    const usuario = this.usuarioSubject.getValue();
    return usuario?.nombre || null;
  }

  // -------------------------------------------------------
  // VERIFICAR TOKEN AL INICIAR EL SERVICIO
  // -------------------------------------------------------
  verificarTokenAlIniciar() {
    const token = this.obtenerToken();

    if (!token || this.tokenExpirado(token)) {
      this.logout();
      return;
    }

    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      const usuario = JSON.parse(userStr) as Usuario;
      this.usuarioSubject.next(usuario);
    }
  }
}
