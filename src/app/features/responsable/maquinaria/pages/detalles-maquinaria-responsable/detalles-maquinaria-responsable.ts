import { Component } from '@angular/core';
import { SidebarResponsable } from '../../../../../shared/components/sidebar-responsable/sidebar-responsable';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { environment } from '../../../../../../environments/environment.prod';
import { HojaVida } from '../../../../../core/models/hoja_vida.models';
import { MantenimientoProgramado } from '../../../../../core/models/mantenimiento-programado.models';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { HojaVidaService } from '../../../../../core/services/hoja-vida.service';
import { MessageService } from '../../../../../core/services/message.service';
import { MantenimientoProgramadoService } from '../../../../../core/services/mantenimiento-programado.service';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-detalles-maquinaria-responsable',
  imports: [CommonModule, RouterLink, FormsModule, SidebarResponsable],
  templateUrl: './detalles-maquinaria-responsable.html',
  styleUrl: './detalles-maquinaria-responsable.scss',
})
export class DetallesMaquinariaResponsable {
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

  // Eliminación
  mostrarConfirmacionEliminar: boolean = false;
  cargandoEliminacion: boolean = false;

  // Mantenimientos programados
  mantenimientos: MantenimientoProgramado[] = [];
  cargandoMantenimientos: boolean = false;
  mostrarFormMantenimiento: boolean = false;
  cargandoMantenimientoOperacion: boolean = false;
  mantenimientoForm: {
    nombre: string;
    tipo: 'preventivo' | 'predictivo' | '';
    intervalo_horas: number | null;
    descripcion: string | null;
  } = {
    nombre: 'General',
    tipo: 'preventivo',
    intervalo_horas: null,
    descripcion: null,
  };
  erroresMantenimiento: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maquinariaService: MaquinariaService,
    private hojaVidaService: HojaVidaService,
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

  abrirFormularioMantenimiento(): void {
    this.mostrarFormMantenimiento = true;
    // valores por defecto
    this.mantenimientoForm = {
      nombre: '',
      tipo: '',
      intervalo_horas: null,
      descripcion: null,
    };
    this.erroresMantenimiento = {};
  }

  cancelarFormularioMantenimiento(): void {
    this.mostrarFormMantenimiento = false;
    this.erroresMantenimiento = {};
  }

  private validarMantenimiento(): boolean {
    this.erroresMantenimiento = {};
    const nombre = (this.mantenimientoForm.nombre ?? '').toString().trim();
    const tipo = (this.mantenimientoForm.tipo ?? '').toString().trim();
    const intervalo = this.mantenimientoForm.intervalo_horas;

    if (!nombre || nombre.length === 0) {
      this.erroresMantenimiento['nombre'] = 'El nombre es obligatorio.';
    }
    if (!tipo || (tipo !== 'preventivo' && tipo !== 'predictivo')) {
      this.erroresMantenimiento['tipo'] = 'Selecciona tipo: preventivo o predictivo.';
    }
    if (intervalo === null || intervalo === undefined || Number.isNaN(intervalo)) {
      this.erroresMantenimiento['intervalo_horas'] = 'El intervalo en horas es obligatorio.';
    } else if (!Number.isInteger(intervalo) || intervalo <= 0) {
      this.erroresMantenimiento['intervalo_horas'] = 'El intervalo debe ser un entero mayor que 0.';
    } else if (intervalo > 100000) {
      this.erroresMantenimiento['intervalo_horas'] = 'El intervalo no puede exceder 100,000 horas.';
    }
    if (
      this.mantenimientoForm.descripcion &&
      this.mantenimientoForm.descripcion.trim().length === 0
    ) {
      this.erroresMantenimiento['descripcion'] = 'La descripción no puede contener solo espacios.';
    }

    return Object.keys(this.erroresMantenimiento).length === 0;
  }

  crearMantenimientoProgramado(): void {
    if (!this.maquinaria || !this.maquinaria.id_maquina) {
      this.message.showWarning('Maquinaria no disponible.');
      return;
    }

    if (!this.validarMantenimiento()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    const payload: any = {
      maquina: this.maquinaria.id_maquina,
      nombre: (this.mantenimientoForm.nombre || 'General').trim(),
      tipo: this.mantenimientoForm.tipo,
      intervalo_horas: Number(this.mantenimientoForm.intervalo_horas),
      descripcion: this.mantenimientoForm.descripcion
        ? this.mantenimientoForm.descripcion.trim()
        : null,
    };

    this.cargandoMantenimientoOperacion = true;
    this.mantenimientoService.crear(payload).subscribe({
      next: (created) => {
        this.cargandoMantenimientoOperacion = false;
        this.message.showWarning('Mantenimiento programado creado.');
        this.mostrarFormMantenimiento = false;
        // recargar lista
        this.cargarMantenimientos();
      },
      error: (err) => {
        this.cargandoMantenimientoOperacion = false;
        console.error('Error crear mantenimiento', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.erroresMantenimiento[k] = Array.isArray(err.error[k])
              ? err.error[k][0]
              : String(err.error[k]);
          });
        } else {
          this.message.showWarning('Error al crear el mantenimiento programado.');
        }
      },
    });
  }

  abrirDetalleMantenimiento(id_programado: number): void {
    this.router.navigate(['/detalles-mantenimiento-programado-responsable', id_programado]);
  }

  salir(): void {
    this.authService.logout();
  }
}
