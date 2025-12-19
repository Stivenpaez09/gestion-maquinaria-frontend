import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Maquinaria, MaquinariaUpdate } from '../../../../../core/models/maquinaria.models';
import { HojaVida } from '../../../../../core/models/hoja_vida.models';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { HojaVidaService } from '../../../../../core/services/hoja-vida.service';
import { MessageService } from '../../../../../core/services/message.service';
import { environment } from '../../../../../../environments/environment.prod';
import { Usuario } from '../../../../../core/models/usuario.models';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MantenimientoProgramado } from '../../../../../core/models/mantenimiento-programado.models';
import { MantenimientoProgramadoService } from '../../../../../core/services/mantenimiento-programado.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-detalles-maquinaria-admin',
  imports: [CommonModule, RouterLink, FormsModule, SidebarAdmin],
  templateUrl: './detalles-maquinaria-admin.html',
  styleUrl: './detalles-maquinaria-admin.scss',
})
export class DetallesMaquinariaAdmin implements OnInit {
  // Datos principales
  maquinaria: Maquinaria | null = null;
  id_maquina: number | null = null;
  cargando: boolean = true;
  environment = environment;

  // Hojas de vida
  hojasVida: HojaVida[] = [];
  mostrarFormHojaVida: boolean = false;
  cargandoHojaVida: boolean = false;

  // Formulario Hoja de Vida
  formularioHojaVida = {
    descripcion: '',
    archivo: null as File | null,
    fecha_registro: new Date().toISOString().split('T')[0],
    usuario: null as number | null, // id del usuario responsable (opcional)
  };

  archivoNombre: string = '';
  erroresHojaVida: { [key: string]: string } = {};
  usuarios: Usuario[] = [];
  // Edición
  modoEdicion: boolean = false;
  maquinariaOriginal: Partial<Maquinaria> = {};
  maquinariaEditada: Partial<Maquinaria> = {};
  camposModificados: Set<string> = new Set();
  erroresEdicion: { [key: string]: string } = {};
  cargandoEdicion: boolean = false;

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
      this.cargarUsuarios();
      this.cargarMantenimientos();
    }
  }

  // -------------------------------------------------------
  // CARGAR USUARIOS
  // -------------------------------------------------------
  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (users) => {
        this.usuarios = users;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
      },
    });
  }

  // -------------------------------------------------------
  // CARGAR MAQUINARIA
  // -------------------------------------------------------
  cargarMaquinaria(): void {
    if (!this.id_maquina) return;

    this.maquinariaService.getMaquinariaById(this.id_maquina).subscribe({
      next: (maquinaria) => {
        this.maquinaria = maquinaria;
        this.maquinariaEditada = { ...maquinaria };
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
  // MANEJO DE ARCHIVO HOJA DE VIDA
  // -------------------------------------------------------
  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];

      // Validar tamaño (máximo 10MB)
      if (archivo.size > 10 * 1024 * 1024) {
        this.message.showWarning('El archivo no debe exceder 10MB');
        return;
      }

      this.formularioHojaVida.archivo = archivo;
      this.archivoNombre = archivo.name;
    }
  }

  limpiarArchivo(): void {
    this.formularioHojaVida.archivo = null;
    this.archivoNombre = '';
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  }

  // -------------------------------------------------------
  // VALIDAR FORMULARIO HOJA DE VIDA
  // -------------------------------------------------------
  private validarFormularioHojaVida(): boolean {
    this.erroresHojaVida = {};

    if (!this.formularioHojaVida.descripcion?.trim()) {
      this.erroresHojaVida['descripcion'] = 'La descripción es obligatoria.';
    } else if (this.formularioHojaVida.descripcion.length > 2000) {
      this.erroresHojaVida['descripcion'] = 'La descripción no puede exceder 2000 caracteres.';
    }

    if (!this.formularioHojaVida.fecha_registro) {
      this.erroresHojaVida['fecha_registro'] = 'La fecha de registro es obligatoria.';
    } else {
      const fecha = new Date(this.formularioHojaVida.fecha_registro);
      const hoy = new Date();
      if (fecha > hoy) {
        this.erroresHojaVida['fecha_registro'] = 'La fecha no puede ser futura.';
      }
    }

    return Object.keys(this.erroresHojaVida).length === 0;
  }

  // -------------------------------------------------------
  // CREAR HOJA DE VIDA
  // -------------------------------------------------------
  crearHojaVida(): void {
    if (!this.validarFormularioHojaVida() || !this.id_maquina) {
      this.message.showWarning('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.cargandoHojaVida = true;

    const formData = new FormData();
    formData.append('maquinaria', this.id_maquina.toString());
    formData.append('descripcion', this.formularioHojaVida.descripcion);
    formData.append('fecha_registro', this.formularioHojaVida.fecha_registro);

    if (this.formularioHojaVida.usuario !== null && this.formularioHojaVida.usuario !== undefined) {
      formData.append('usuario', String(this.formularioHojaVida.usuario));
    }

    if (this.formularioHojaVida.archivo) {
      formData.append(
        'archivo',
        this.formularioHojaVida.archivo,
        this.formularioHojaVida.archivo.name
      );
    }

    this.hojaVidaService.createHojaVidaFormData(formData).subscribe({
      next: (hojaVida) => {
        this.cargandoHojaVida = false;
        this.message.showWarning('Hoja de vida creada exitosamente.');
        this.limpiarFormularioHojaVida();
        this.cargarHojasVida();
      },
      error: (error) => {
        this.cargandoHojaVida = false;
        console.error('Error al crear hoja de vida:', error);

        if (error.error && typeof error.error === 'object') {
          Object.keys(error.error).forEach((key) => {
            const mensaje = error.error[key];
            this.erroresHojaVida[key] = Array.isArray(mensaje) ? mensaje[0] : mensaje;
          });
        }

        const mensajeError = Object.values(this.erroresHojaVida).join(' ');
        this.message.showWarning(mensajeError || 'Error al crear la hoja de vida.');
      },
    });
  }

  limpiarFormularioHojaVida(): void {
    this.formularioHojaVida = {
      descripcion: '',
      archivo: null,
      fecha_registro: new Date().toISOString().split('T')[0],
      usuario: null,
    };
    this.archivoNombre = '';
    this.erroresHojaVida = {};
    this.mostrarFormHojaVida = false;
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
  // ELIMINAR HOJA DE VIDA
  // -------------------------------------------------------
  eliminarHojaVida(id_hoja: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar esta hoja de vida?')) {
      return;
    }

    this.hojaVidaService.deleteHojaVida(id_hoja).subscribe({
      next: () => {
        this.message.showWarning('Hoja de vida eliminada.');
        this.cargarHojasVida();
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al eliminar hoja de vida.');
      },
    });
  }

  // -------------------------------------------------------
  // EDICIÓN DE MAQUINARIA
  // -------------------------------------------------------
  activarEdicion(): void {
    this.modoEdicion = true;
    this.maquinariaOriginal = { ...this.maquinaria };
    this.maquinariaEditada = { ...this.maquinaria };
    this.camposModificados.clear();
    this.erroresEdicion = {};
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.maquinariaEditada = { ...this.maquinaria };
    this.camposModificados.clear();
    this.erroresEdicion = {};
  }

  // Detectar cambios en cada campo
  onCampoModificado(nombreCampo: string): void {
    const valorOriginal = this.maquinariaOriginal[nombreCampo as keyof Maquinaria];
    const valorActual = this.maquinariaEditada[nombreCampo as keyof Maquinaria];

    if (valorOriginal !== valorActual) {
      this.camposModificados.add(nombreCampo);
    } else {
      this.camposModificados.delete(nombreCampo);
    }
  }

  private validarEdicion(): boolean {
    this.erroresEdicion = {};

    // Validar solo los campos que fueron modificados
    if (this.camposModificados.has('nombre_maquina')) {
      if (!this.maquinariaEditada.nombre_maquina?.trim()) {
        this.erroresEdicion['nombre_maquina'] = 'El nombre es obligatorio.';
      } else if (
        this.maquinariaEditada.nombre_maquina.length < 3 ||
        this.maquinariaEditada.nombre_maquina.length > 100
      ) {
        this.erroresEdicion['nombre_maquina'] = 'El nombre debe tener entre 3 y 100 caracteres.';
      }
    }

    if (this.camposModificados.has('modelo') && this.maquinariaEditada.modelo) {
      if (this.maquinariaEditada.modelo.length < 2 || this.maquinariaEditada.modelo.length > 100) {
        this.erroresEdicion['modelo'] = 'El modelo debe tener entre 2 y 100 caracteres.';
      }
    }

    if (this.camposModificados.has('marca') && this.maquinariaEditada.marca) {
      if (this.maquinariaEditada.marca.length < 2 || this.maquinariaEditada.marca.length > 100) {
        this.erroresEdicion['marca'] = 'La marca debe tener entre 2 y 100 caracteres.';
      }
    }

    if (this.camposModificados.has('horas_totales')) {
      if (this.maquinariaEditada.horas_totales !== undefined) {
        if (this.maquinariaEditada.horas_totales < 0) {
          this.erroresEdicion['horas_totales'] = 'Las horas no pueden ser negativas.';
        } else if (this.maquinariaEditada.horas_totales > 99999999.99) {
          this.erroresEdicion['horas_totales'] = 'El valor de horas es demasiado grande.';
        }
      }
    }

    if (this.camposModificados.has('estado')) {
      if (
        this.maquinariaEditada.estado === 'operativa' &&
        this.maquinariaEditada.horas_totales === 0
      ) {
        this.erroresEdicion['horas_totales'] = 'Una máquina operativa debe tener más de 0 horas.';
      }
    }

    return Object.keys(this.erroresEdicion).length === 0;
  }

  guardarEdicion(): void {
    if (this.camposModificados.size === 0) {
      this.message.showWarning('No hay cambios para guardar.');
      return;
    }

    if (!this.validarEdicion() || !this.id_maquina) {
      this.message.showWarning('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.cargandoEdicion = true;

    // Crear objeto solo con campos modificados
    const datosAActualizar: Partial<MaquinariaUpdate> = {};

    this.camposModificados.forEach((campo) => {
      const valor = this.maquinariaEditada[campo as keyof Maquinaria];
      if (valor !== null && valor !== undefined) {
        (datosAActualizar as Record<string, any>)[campo] = valor;
      }
    });

    this.maquinariaService.patchMaquinaria(this.id_maquina!, datosAActualizar).subscribe({
      next: (maquinaria) => {
        this.cargandoEdicion = false;
        this.message.showWarning('Maquinaria actualizada exitosamente.');
        this.maquinaria = maquinaria;
        this.modoEdicion = false;
        this.camposModificados.clear();
      },
      error: (error) => {
        this.cargandoEdicion = false;
        console.error('Error al actualizar:', error);

        if (error.error && typeof error.error === 'object') {
          Object.keys(error.error).forEach((key) => {
            const mensaje = error.error[key];
            this.erroresEdicion[key] = Array.isArray(mensaje) ? mensaje[0] : mensaje;
          });
        }

        const mensajeError = Object.values(this.erroresEdicion).join(' ');
        this.message.showWarning(mensajeError || 'Error al actualizar.');
      },
    });
  }

  // -------------------------------------------------------
  // ELIMINACIÓN DE MAQUINARIA
  // -------------------------------------------------------
  confirmarEliminar(): void {
    this.mostrarConfirmacionEliminar = true;
  }

  cancelarEliminacion(): void {
    this.mostrarConfirmacionEliminar = false;
  }

  eliminarMaquinaria(): void {
    if (!this.id_maquina) return;

    this.cargandoEliminacion = true;

    this.maquinariaService.deleteMaquinaria(this.id_maquina).subscribe({
      next: () => {
        this.cargandoEliminacion = false;
        this.message.showWarning('Maquinaria eliminada exitosamente.');
        setTimeout(() => {
          this.router.navigate(['/ver-maquinarias-admin']);
        }, 1500);
      },
      error: (error) => {
        this.cargandoEliminacion = false;
        this.message.showWarning(error.error?.detail || 'Error al eliminar maquinaria.');
      },
    });
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

  tieneError(campo: string): boolean {
    return !!this.erroresEdicion[campo];
  }

  obtenerError(campo: string): string {
    return this.erroresEdicion[campo] || '';
  }

  tieneErrorHojaVida(campo: string): boolean {
    return !!this.erroresHojaVida[campo];
  }

  obtenerErrorHojaVida(campo: string): string {
    return this.erroresHojaVida[campo] || '';
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
    this.router.navigate(['/detalles-mantenimiento-programado-admin', id_programado]);
  }

  salir(): void {
    this.authService.logout();
  }
}
