import { Component } from '@angular/core';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { environment } from '../../../../../../environments/environment.prod';
import { HojaVida } from '../../../../../core/models/hoja_vida.models';
import { Usuario } from '../../../../../core/models/auth.models';
import { MantenimientoProgramado } from '../../../../../core/models/mantenimiento-programado.models';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { HojaVidaService } from '../../../../../core/services/hoja-vida.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MessageService } from '../../../../../core/services/message.service';
import { MantenimientoProgramadoService } from '../../../../../core/services/mantenimiento-programado.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarOperador } from '../../../../../shared/components/sidebar-operador/sidebar-operador';

@Component({
  selector: 'app-detalles-maquinaria-operador',
  imports: [CommonModule, RouterLink, FormsModule, SidebarOperador],
  templateUrl: './detalles-maquinaria-operador.html',
  styleUrl: './detalles-maquinaria-operador.scss',
})
export class DetallesMaquinariaOperador {
  // Datos principales
  maquinaria: Maquinaria | null = null;
  id_maquina: number | null = null;
  cargando: boolean = true;
  environment = environment;

  // Hojas de vida
  hojasVida: HojaVida[] = [];
  mostrarFormHojaVida: boolean = false;
  cargandoHojaVida: boolean = false;
  archivoNombre: string = '';

  // Mantenimientos programados
  mantenimientos: MantenimientoProgramado[] = [];
  cargandoMantenimientos: boolean = false;
  mostrarFormMantenimiento: boolean = false;
  cargandoMantenimientoOperacion: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maquinariaService: MaquinariaService,
    private hojaVidaService: HojaVidaService,
    private usuarioService: UsuarioService,
    private message: MessageService,
    private mantenimientoService: MantenimientoProgramadoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.id_maquina = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id_maquina) {
      this.cargarMaquinaria();
      this.cargarHojasVida();
      this.cargarMantenimientos();
    }
  }

  // -------------------------------------------------------
  // CARGAR MAQUINARIA
  // -------------------------------------------------------
  cargarMaquinaria(): void {
    if (!this.id_maquina) return;

    this.maquinariaService.getMaquinariaById(this.id_maquina).subscribe({
      next: (maquinaria) => {
        this.maquinaria = maquinaria;
        this.cargando = false;
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al cargar maquinaria');
        this.cargando = false;
      },
    });
  }

  // -------------------------------------------------------
  // CARGAR HOJAS DE VIDA
  // -------------------------------------------------------
  cargarHojasVida(): void {
    if (!this.id_maquina) return;

    this.hojaVidaService.getHojasVidaByMaquinaria(this.id_maquina).subscribe({
      next: (hojas) => {
        this.hojasVida = hojas;
      },
      error: (error) => {
        console.error('Error al cargar hojas de vida:', error);
      },
    });
  }

  // -------------------------------------------------------
  // CARGAR MANTENIMIENTOS PROGRAMADOS
  // -------------------------------------------------------
  private cargarMantenimientos(): void {
    if (!this.id_maquina) return;
    this.cargandoMantenimientos = true;
    this.mantenimientoService.obtenerPorMaquina(this.id_maquina).subscribe({
      next: (data) => {
        this.mantenimientos = data;
        this.cargandoMantenimientos = false;
      },
      error: (err) => {
        console.error('Error cargar mantenimientos', err);
        this.message.showWarning('No se pudieron cargar los mantenimientos programados.');
        this.cargandoMantenimientos = false;
      },
    });
  }

  // -------------------------------------------------------
  // OBTENER URL DE ARCHIVO (HOJA DE VIDA)
  // -------------------------------------------------------
  obtenerArchivoUrl(rutaArchivo: string | null): string {
    if (!rutaArchivo) return '';
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    // Asegura que haya una barra entre base y ruta si es necesario
    return rutaArchivo.startsWith('/') ? `${baseUrl}${rutaArchivo}` : `${baseUrl}/${rutaArchivo}`;
  }

  abrirEnPestana(rutaArchivo: string | null): void {
    const url = this.obtenerArchivoUrl(rutaArchivo);
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  }

  // -------------------------------------------------------
  // OBTENER URL DE FOTO
  // -------------------------------------------------------
  obtenerFotoUrl(foto: string | null): string {
    if (!foto) {
      return 'assets/images/maquina-default.jpeg';
    }
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    return `${baseUrl}${foto}`;
  }

  // -------------------------------------------------------
  // UTILIDADES
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

  abrirDetalleMantenimiento(id_programado: number): void {
    this.router.navigate(['/detalles-mantenimiento-programado-operador', id_programado]);
  }

  salir(): void {
    this.authService.logout();
  }
}
