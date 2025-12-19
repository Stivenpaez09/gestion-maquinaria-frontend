import { Component } from '@angular/core';
import { SidebarOperador } from '../../../../../shared/components/sidebar-operador/sidebar-operador';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { environment } from '../../../../../../environments/environment.prod';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { MessageService } from '../../../../../core/services/message.service';

@Component({
  selector: 'app-ver-maquinarias-operador',
  imports: [CommonModule, RouterLink, FormsModule, SidebarOperador],
  templateUrl: './ver-maquinarias-operador.html',
  styleUrl: './ver-maquinarias-operador.scss',
})
export class VerMaquinariasOperador {
  // Datos
  maquinarias: Maquinaria[] = [];
  maquinariasFiltradas: Maquinaria[] = [];

  // Búsqueda
  searchTerm: string = '';

  // Filtros
  filtroActual: string = 'todas';

  // Paginación
  readonly itemsPorPagina = 9;
  paginaActual: number = 1;
  totalPaginas: number = 1;
  maquinariosPaginados: Maquinaria[] = [];

  // Environment
  environment = environment;

  constructor(private maquinariaService: MaquinariaService, private message: MessageService) {}

  ngOnInit(): void {
    this.cargarTodasMaquinarias();
  }

  // -------------------------------------------------------
  // CARGAR MAQUINARIAS
  // -------------------------------------------------------
  cargarTodasMaquinarias(): void {
    this.maquinariaService.getMaquinarias().subscribe({
      next: (maquinarias) => {
        this.maquinarias = maquinarias;
        this.maquinariasFiltradas = maquinarias;
        this.filtroActual = 'todas';
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al cargar maquinarias');
      },
    });
  }

  cargarMaquinariasEnOperacion(): void {
    this.maquinariaService.getMaquinariasEnOperacion().subscribe({
      next: (maquinarias) => {
        this.maquinarias = maquinarias;
        this.maquinariasFiltradas = maquinarias;
        this.filtroActual = 'en-operacion';
        this.searchTerm = '';
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al cargar maquinarias en operación');
      },
    });
  }

  cargarMaquinariasVencidas(): void {
    this.maquinariaService.getMaquinariasVencidas().subscribe({
      next: (maquinarias) => {
        this.maquinarias = maquinarias;
        this.maquinariasFiltradas = maquinarias;
        this.filtroActual = 'vencidas';
        this.searchTerm = '';
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al cargar maquinarias vencidas');
      },
    });
  }

  cargarMaquinariasPendientes(): void {
    this.maquinariaService.getMaquinariasPendientes().subscribe({
      next: (maquinarias) => {
        this.maquinarias = maquinarias;
        this.maquinariasFiltradas = maquinarias;
        this.filtroActual = 'pendientes';
        this.searchTerm = '';
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al cargar maquinarias pendientes');
      },
    });
  }

  cargarMaquinariasAlDia(): void {
    this.maquinariaService.getMaquinariasAlDia().subscribe({
      next: (maquinarias) => {
        this.maquinarias = maquinarias;
        this.maquinariasFiltradas = maquinarias;
        this.filtroActual = 'al-dia';
        this.searchTerm = '';
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al cargar maquinarias al día');
      },
    });
  }

  // -------------------------------------------------------
  // BÚSQUEDA
  // -------------------------------------------------------
  buscar(): void {
    if (!this.searchTerm.trim()) {
      this.maquinariasFiltradas = [...this.maquinarias];
    } else {
      this.maquinariasFiltradas = this.maquinarias.filter((maquinaria) =>
        maquinaria.nombre_maquina.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  // -------------------------------------------------------
  // PAGINACIÓN
  // -------------------------------------------------------
  private actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.maquinariasFiltradas.length / this.itemsPorPagina);
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
    }
    if (this.paginaActual < 1) {
      this.paginaActual = 1;
    }
    this.obtenerPagina();
  }

  private obtenerPagina(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.maquinariosPaginados = this.maquinariasFiltradas.slice(inicio, fin);
  }

  irAPaginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerPagina();
    }
  }

  irAPaginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.obtenerPagina();
    }
  }

  // -------------------------------------------------------
  // OBTENER URL DE FOTO
  // -------------------------------------------------------
  obtenerFotoUrl(foto: string | null): string {
    console.log('Foto:', foto);
    if (!foto) {
      return 'assets/images/login-imagen.jpg';
    }
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    console.log(`Base URL ${baseUrl}${foto}`);
    return `${baseUrl}${foto}`;
  }

  // -------------------------------------------------------
  // OBTENER BADGE DE ESTADO
  // -------------------------------------------------------
  obtenerClasesEstado(estado: string): string {
    switch (estado) {
      case 'operativa':
        return 'bg-blue-600/20 text-blue-400';
      case 'en mantenimiento':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'fuera de servicio':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  }
}
