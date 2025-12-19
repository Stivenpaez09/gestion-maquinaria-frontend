import { Component } from '@angular/core';
import { SidebarResponsable } from '../../../../../shared/components/sidebar-responsable/sidebar-responsable';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Maquinaria, MaquinariaResumen } from '../../../../../core/models/maquinaria.models';
import { Usuario } from '../../../../../core/models/usuario.models';
import { environment } from '../../../../../../environments/environment.prod';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { AlarmaService } from '../../../../../core/services/alarma.service';
import { MessageService } from '../../../../../core/services/message.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink, SidebarResponsable],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  ultimasMaquinarias: Maquinaria[] = [];
  maquinariasActual: Maquinaria[] = [];
  usuario: Usuario | null = null;
  alarmas: number = 0;
  resumen: MaquinariaResumen | null = null;
  filtroActual: string = 'ultimas';
  environment = environment;

  // Paginación
  readonly itemsPorPagina = 10;
  paginaActual: number = 1;
  totalPaginas: number = 1;
  maquinariosPaginados: Maquinaria[] = [];

  constructor(
    private maquinariaService: MaquinariaService,
    private authService: AuthService,
    private alarmaService: AlarmaService,
    private message: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMaquinarias();
    this.getUsuario();
    this.getAlarmasNoVistas();
    this.getResumenMaquinarias();
  }

  // -------------------------------------------------------
  // Método auxiliar para actualizar paginación
  // -------------------------------------------------------
  private actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.maquinariasActual.length / this.itemsPorPagina);
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
    }
    if (this.paginaActual < 1) {
      this.paginaActual = 1;
    }
    this.obtenerPagina();
  }

  // -------------------------------------------------------
  // Obtener items de la página actual
  // -------------------------------------------------------
  private obtenerPagina(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.maquinariosPaginados = this.maquinariasActual.slice(inicio, fin);
  }

  // -------------------------------------------------------
  // Navegación de paginación
  // -------------------------------------------------------
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
  // MÉTODOS DE FILTRADO
  // -------------------------------------------------------
  getMaquinarias(): void {
    this.maquinariaService.getUltimasMaquinarias().subscribe({
      next: (maquinarias) => {
        this.ultimasMaquinarias = maquinarias;
        this.maquinariasActual = maquinarias;
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al obtener las maquinarias');
      },
    });
  }

  getMaquinariasEnOperacion(): void {
    this.maquinariaService.getMaquinariasEnOperacion().subscribe({
      next: (maquinarias) => {
        this.maquinariasActual = maquinarias;
        this.filtroActual = 'en-operacion';
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(
          error.error?.detail || 'Error al obtener las maquinarias en operación'
        );
      },
    });
  }

  getMaquinariasAlDia(): void {
    this.maquinariaService.getMaquinariasAlDia().subscribe({
      next: (maquinarias) => {
        this.maquinariasActual = maquinarias;
        this.filtroActual = 'al-dia';
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al obtener las maquinarias al día');
      },
    });
  }

  getMaquinariasPendientes(): void {
    this.maquinariaService.getMaquinariasPendientes().subscribe({
      next: (maquinarias) => {
        this.maquinariasActual = maquinarias;
        this.filtroActual = 'pendientes';
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(
          error.error?.detail || 'Error al obtener las maquinarias pendientes'
        );
      },
    });
  }

  getMaquinariasVencidas(): void {
    this.maquinariaService.getMaquinariasVencidas().subscribe({
      next: (maquinarias) => {
        this.maquinariasActual = maquinarias;
        this.filtroActual = 'vencidos';
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        this.message.showWarning(
          error.error?.detail || 'Error al obtener las maquinarias vencidas'
        );
      },
    });
  }

  getUsuario(): void {
    this.usuario = this.authService.obtenerUsuario();
  }

  getAlarmasNoVistas(): void {
    this.alarmaService.getCantidadNoVistas().subscribe({
      next: (cantidad) => {
        this.alarmas = cantidad.cantidad_no_vistas;
      },
      error: (error) => {
        this.message.showWarning(
          error.error?.detail || 'Error al obtener la cantidad de alarmas nuevas'
        );
      },
    });
  }

  getResumenMaquinarias(): void {
    this.maquinariaService.getResumenMaquinarias().subscribe({
      next: (resumen) => {
        this.resumen = resumen;
        console.log('Resumen de maquinarias:', this.resumen);
      },
      error: (error) => {
        this.message.showWarning(
          error.error?.detail || 'Error al obtener el resumen de maquinarias'
        );
      },
    });
  }

  getFotoUrl(): string {
    if (!this.usuario?.foto) {
      return 'assets/images/operador.jpg';
    }
    const baseUrl = this.environment.apiUrl.replace(/\/$/, '');
    return `${baseUrl}${this.usuario.foto}`;
  }
}
