import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MantenimientoService } from '../../../../../core/services/mantenimiento.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Mantenimiento } from '../../../../../core/models/mantenimiento-models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment.prod';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-ver-mantenimientos-admin',
  imports: [RouterLink, CommonModule, FormsModule, SidebarAdmin],
  templateUrl: './ver-mantenimientos-admin.html',
  styleUrl: './ver-mantenimientos-admin.scss',
})
export class VerMantenimientosAdmin implements OnInit {
  mantenimientos: Mantenimiento[] = [];
  mantenimientosPaginados: Mantenimiento[] = [];
  cargando = false;

  searchTerm: string = '';
  filtroTipo: string = 'todos';
  paginaActual: number = 1;
  itemsPorPagina: number = 9;
  totalPaginas: number = 1;

  constructor(
    private mantenimientoService: MantenimientoService,
    private router: Router,
    private authService: AuthService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarMantenimientos();
  }

  salir(): void {
    this.authService.logout();
  }

  cargarMantenimientos(): void {
    this.cargando = true;
    this.mantenimientoService.listar().subscribe({
      next: (data) => {
        // ordenar por fecha descendente
        this.mantenimientos = data.sort((a, b) =>
          (b.fecha_mantenimiento || '').localeCompare(a.fecha_mantenimiento || '')
        );
        this.paginaActual = 1;
        this.aplicarFiltroYPaginacion();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando mantenimientos', err);
        this.message.showWarning('No se pudieron cargar los mantenimientos.');
        this.cargando = false;
      },
    });
  }

  aplicarFiltroYPaginacion(): void {
    const termino = (this.searchTerm || '').trim().toLowerCase();
    let filtrados = this.mantenimientos.slice();

    if (termino) {
      filtrados = filtrados.filter((m) => {
        return (
          (m.descripcion || '').toLowerCase().includes(termino) ||
          (m.tipo_mantenimiento || '').toLowerCase().includes(termino) ||
          String(m.id_mantenimiento).includes(termino)
        );
      });
    }

    if (this.filtroTipo && this.filtroTipo !== 'todos') {
      filtrados = filtrados.filter((m) => m.tipo_mantenimiento === this.filtroTipo);
    }

    this.totalPaginas = Math.max(1, Math.ceil(filtrados.length / this.itemsPorPagina));
    if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;

    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    this.mantenimientosPaginados = filtrados.slice(start, start + this.itemsPorPagina);
  }

  buscar(): void {
    this.paginaActual = 1;
    this.aplicarFiltroYPaginacion();
  }

  cambiarFiltroTipo(tipo: string): void {
    this.filtroTipo = tipo;
    this.paginaActual = 1;
    this.aplicarFiltroYPaginacion();
  }

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

  obtenerFotoUrl(foto?: string | null): string {
    if (!foto) {
      return '/assets/images/mantenimiento-default.jpg';
    }
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    return `${baseUrl}${foto}`;
  }

  verDetalle(m: Mantenimiento): void {
    this.router.navigate(['/detalles-mantenimiento-admin', m.id_mantenimiento]);
  }
}
