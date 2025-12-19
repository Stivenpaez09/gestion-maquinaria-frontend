import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { RegistroHorasMaquinariaService } from '../../../../../core/services/registro-horas-maquinaria.service';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { ProyectoService } from '../../../../../core/services/proyecto.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MessageService } from '../../../../../core/services/message.service';
import { RegistroHorasMaquinaria } from '../../../../../core/models/registro-horas-maquinaria';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { Proyecto } from '../../../../../core/models/proyecto.models';
import { Usuario } from '../../../../../core/models/usuario.models';
import { environment } from '../../../../../../environments/environment.prod';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-detalles-registro-horas-maquinaria-admin',
  imports: [CommonModule, FormsModule, RouterLink, SidebarAdmin],
  templateUrl: './detalles-registro-horas-maquinaria-admin.html',
  styleUrl: './detalles-registro-horas-maquinaria-admin.scss',
})
export class DetallesRegistroHorasMaquinariaAdmin implements OnInit {
  registro: RegistroHorasMaquinaria | null = null;
  id_registro: number | null = null;
  cargando: boolean = true;

  // Datos relacionados
  maquinariaObj: Maquinaria | null = null;
  proyectoObj: Proyecto | null = null;
  usuarioObj: Usuario | null = null;

  // Edición
  modoEdicion: boolean = false;
  registroForm: { fecha: string; observaciones: string | null } = {
    fecha: '',
    observaciones: null,
  };
  registroOriginal: { fecha: string; observaciones: string | null } = {
    fecha: '',
    observaciones: null,
  };
  errores: { [key: string]: string } = {};
  cargandoOperacion: boolean = false;

  // Eliminación
  cargandoEliminacion: boolean = false;

  environment = environment;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private registroService: RegistroHorasMaquinariaService,
    private maquinariaService: MaquinariaService,
    private proyectoService: ProyectoService,
    private usuarioService: UsuarioService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.id_registro = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id_registro) {
      this.cargarRegistro();
    }
  }

  salir(): void {
    this.authService.logout();
  }

  cargarRegistro(): void {
    if (!this.id_registro) return;
    this.cargando = true;
    this.registroService.obtenerPorId(this.id_registro).subscribe({
      next: (registro) => {
        this.registro = registro;
        this.registroForm = {
          fecha: registro.fecha ? registro.fecha.split('T')[0] : '',
          observaciones: registro.observaciones || null,
        };
        this.registroOriginal = JSON.parse(JSON.stringify(this.registroForm));

        // Cargar datos relacionados
        this.cargarDatosRelacionados();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargar registro', err);
        this.message.showWarning('No se pudo cargar el registro.');
        this.cargando = false;
      },
    });
  }

  cargarDatosRelacionados(): void {
    if (!this.registro) return;

    // Cargar maquinaria
    this.maquinariaService.getMaquinariaById(this.registro.maquina).subscribe({
      next: (maquina) => (this.maquinariaObj = maquina),
      error: () => (this.maquinariaObj = null),
    });

    // Cargar proyecto si existe
    if (this.registro.proyecto) {
      this.proyectoService.getProyectoById(this.registro.proyecto).subscribe({
        next: (proyecto) => (this.proyectoObj = proyecto),
        error: () => (this.proyectoObj = null),
      });
    }

    // Cargar usuario si existe
    if (this.registro.usuario) {
      this.usuarioService.getUsuarioById(this.registro.usuario).subscribe({
        next: (usuario) => (this.usuarioObj = usuario),
        error: () => (this.usuarioObj = null),
      });
    }
  }

  activarEdicion(): void {
    if (!this.registro) return;
    this.modoEdicion = true;
    this.registroOriginal = JSON.parse(JSON.stringify(this.registroForm));
    this.errores = {};
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errores = {};
    this.registroForm = JSON.parse(JSON.stringify(this.registroOriginal));
  }

  private validarFormulario(): boolean {
    this.errores = {};

    // Validar fecha
    if (!this.registroForm.fecha || this.registroForm.fecha.trim() === '') {
      this.errores['fecha'] = 'La fecha es obligatoria.';
    } else {
      const fecha = new Date(this.registroForm.fecha);
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (fecha > hoy) {
        this.errores['fecha'] = 'La fecha no puede ser futura.';
      }
    }

    // Validar observaciones
    if (this.registroForm.observaciones) {
      const observaciones = this.registroForm.observaciones.trim();
      if (observaciones.length > 2000) {
        this.errores['observaciones'] = 'Las observaciones pueden tener máximo 2000 caracteres.';
      }
    }

    return Object.keys(this.errores).length === 0;
  }

  guardarCambios(): void {
    if (!this.id_registro || !this.registro) return;
    if (!this.validarFormulario()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    // Verificar si hay cambios
    const hayCambios =
      this.registroForm.fecha !== this.registroOriginal.fecha ||
      (this.registroForm.observaciones || '') !== (this.registroOriginal.observaciones || '');

    if (!hayCambios) {
      this.message.showWarning('No hay cambios para guardar.');
      return;
    }

    this.cargandoOperacion = true;

    // Preparar FormData solo con los campos modificados
    const formData = new FormData();
    if (this.registroForm.fecha !== this.registroOriginal.fecha) {
      formData.append('fecha', this.registroForm.fecha);
    }
    if ((this.registroForm.observaciones || '') !== (this.registroOriginal.observaciones || '')) {
      formData.append('observaciones', this.registroForm.observaciones || '');
    }

    this.registroService.actualizar(this.id_registro, formData as any).subscribe({
      next: () => {
        this.cargandoOperacion = false;
        this.message.showWarning('Registro actualizado correctamente.');
        this.modoEdicion = false;
        this.cargarRegistro();
      },
      error: (err) => {
        this.cargandoOperacion = false;
        console.error('Error actualizar registro', err);
        if (err.error && typeof err.error === 'object') {
          const erroresBackend: string[] = [];
          Object.keys(err.error).forEach((k) => {
            const mensaje = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
            this.errores[k] = mensaje;
            erroresBackend.push(mensaje);
          });
          if (erroresBackend.length > 0) {
            this.message.showWarning(erroresBackend.join('. '));
          }
        } else {
          this.message.showWarning('Error al actualizar el registro.');
        }
      },
    });
  }

  eliminarRegistro(): void {
    if (!this.id_registro) return;
    if (
      !confirm(
        '¿Estás seguro de eliminar este registro de horas? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    this.cargandoEliminacion = true;
    this.registroService.eliminar(this.id_registro).subscribe({
      next: () => {
        this.cargandoEliminacion = false;
        this.message.showWarning('Registro eliminado correctamente.');
        this.router.navigate(['/ver-registros-horas-maquinaria-admin']);
      },
      error: (err) => {
        this.cargandoEliminacion = false;
        console.error('Error eliminar registro', err);
        this.message.showWarning('Error al eliminar el registro.');
      },
    });
  }

  obtenerFotoUrl(foto: string | null | undefined): string {
    if (!foto) return '';
    if (foto.startsWith('http')) return foto;
    return `${this.environment.apiUrl}${foto}`;
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  irADetallesMaquinaria(id: number): void {
    this.router.navigate(['/detalles-maquinaria-admin', id]);
  }

  irADetallesProyecto(id: number): void {
    this.router.navigate(['/detalles-proyecto-admin', id]);
  }

  irADetallesUsuario(id: number): void {
    this.router.navigate(['/detalles-usuario-admin', id]);
  }
}
