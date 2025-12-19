import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { Usuario } from '../../../../../core/models/auth.models';
import { environment } from '../../../../../../environments/environment.prod';
import { DatePipe } from '@angular/common';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-ver-perfil-admin',
  imports: [DatePipe, SidebarAdmin],
  templateUrl: './ver-perfil-admin.html',
  styleUrl: './ver-perfil-admin.scss',
})
export class VerPerfilAdmin implements OnInit {
  // Datos principales
  usuario: Usuario | null = null;
  loginUsername: string | null = '';
  loginRol: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    this.loginUsername = this.authService.obtenerUsername();
    this.loginRol = this.authService.obtenerRol();
    if (this.loginRol === 'ADMIN') this.loginRol = 'Administrador';
    if (this.loginRol === 'OPERADOR') this.loginRol = 'Operador';
    if (this.loginRol === 'TECNICO_DE_MANTENIMIENTO') this.loginRol = 'Técnico de Mantenimiento';
    if (this.loginRol === 'RESPONSABLE_DE_MANTENIMIENTO')
      this.loginRol = 'Responsable de Mantenimiento';
  }

  salir(): void {
    this.authService.logout();
  }

  // -------------------------------------------------------
  // OBTENER URL DE FOTO
  // -------------------------------------------------------
  obtenerFotoUrl(): string {
    const foto = this.usuario?.foto;
    if (!foto) {
      return '/assets/images/operador.jpg';
    }
    if (foto.startsWith('http')) {
      return foto;
    }
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    const fotoPath = foto.startsWith('/') ? foto : `/${foto}`;
    return `${baseUrl}${fotoPath}`;
  }

  // -------------------------------------------------------
  // FORMATEAR FECHA
  // -------------------------------------------------------
  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
