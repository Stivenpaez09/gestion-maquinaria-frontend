import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { Usuario } from '../../../../../core/models/usuario.models';
import { environment } from '../../../../../../environments/environment.prod';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-ver-usuarios-admin',
  imports: [CommonModule, RouterModule, RouterLink, FormsModule, SidebarAdmin],
  templateUrl: './ver-usuarios-admin.html',
  styleUrl: './ver-usuarios-admin.scss',
})
export class VerUsuariosAdmin implements OnInit {
  // Datos
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosPaginados: Usuario[] = [];

  // Búsqueda
  searchTerm: string = '';
  cargando: boolean = true;

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 9;
  totalPaginas: number = 1;

  environment = environment;

  constructor(private authService: AuthService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  salir(): void {
    this.authService.logout();
  }

  // -------------------------------------------------------
  // CARGAR DATOS
  // -------------------------------------------------------
  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios || [];
        this.paginaActual = 1;
        this.aplicarFiltroYPaginacion();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.usuariosPaginados = [];
        this.cargando = false;
      },
    });
  }

  // -------------------------------------------------------
  // BÚSQUEDA Y PAGINACIÓN
  // -------------------------------------------------------
  aplicarFiltroYPaginacion(): void {
    const termino = (this.searchTerm || '').trim().toLowerCase();
    let filtrados = this.usuarios.slice();

    // Aplicar filtro de búsqueda
    if (termino) {
      filtrados = filtrados.filter((usuario) => {
        const nombre = (usuario.nombre || '').toLowerCase();
        return nombre.includes(termino);
      });
    }

    this.usuariosFiltrados = filtrados;

    // Calcular paginación
    this.totalPaginas = Math.max(1, Math.ceil(filtrados.length / this.itemsPorPagina));
    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = this.totalPaginas;
    }

    // Obtener items de la página actual
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    this.usuariosPaginados = filtrados.slice(start, start + this.itemsPorPagina);
  }

  buscar(): void {
    this.paginaActual = 1;
    this.aplicarFiltroYPaginacion();
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.paginaActual = 1;
    this.aplicarFiltroYPaginacion();
  }

  // -------------------------------------------------------
  // NAVEGACIÓN DE PÁGINAS
  // -------------------------------------------------------
  irAPaginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.aplicarFiltroYPaginacion();
    }
  }

  irAPaginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.aplicarFiltroYPaginacion();
    }
  }

  // -------------------------------------------------------
  // OBTENER URL DE FOTO
  // -------------------------------------------------------
  obtenerFotoUrl(foto: string | null | undefined): string {
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
