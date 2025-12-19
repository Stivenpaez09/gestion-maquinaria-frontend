import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { MantenimientoService } from '../../../../../core/services/mantenimiento.service';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Mantenimiento } from '../../../../../core/models/mantenimiento-models';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { Usuario } from '../../../../../core/models/usuario.models';
import { environment } from '../../../../../../environments/environment.prod';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-detalles-mantenimiento-admin',
  imports: [CommonModule, FormsModule, SidebarAdmin],
  templateUrl: './detalles-mantenimiento-admin.html',
  styleUrl: './detalles-mantenimiento-admin.scss',
})
export class DetallesMantenimientoAdmin implements OnInit {
  // estado
  cargando = false;
  cargandoOperacion = false;
  cargandoEliminacion = false;
  mostrarConfirmacionEliminar = false;

  // ids y modelos
  id_mantenimiento: number | null = null;
  mantenimiento: Mantenimiento | null = null;
  maquinaObj: Maquinaria | null = null;
  usuarioObj: Usuario | null = null;

  // edición parcial
  modoEdicion = false;
  form: Partial<Mantenimiento> = {};
  originalForm: Partial<Mantenimiento> = {};
  errores: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private mantenimientoService: MantenimientoService,
    private maquinariaService: MaquinariaService,
    private usuarioService: UsuarioService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.id_mantenimiento = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id_mantenimiento) {
      this.cargarMantenimiento();
    }
  }

  salir(): void {
    this.authService.logout();
  }

  // -------------------------------------------------------
  // CARGAR
  // -------------------------------------------------------
  cargarMantenimiento(): void {
    if (!this.id_mantenimiento) return;

    this.cargando = true;
    this.mantenimientoService.obtenerPorId(this.id_mantenimiento).subscribe({
      next: (m) => {
        this.mantenimiento = m;

        this.form = {
          tipo_mantenimiento: m.tipo_mantenimiento, // solo lectura
          descripcion: m.descripcion ?? '',
          fecha_mantenimiento: m.fecha_mantenimiento,
          horas_realizadas: m.horas_realizadas,
          costo: m.costo,
        };

        this.originalForm = JSON.parse(JSON.stringify(this.form));

        this.maquinaObj = null;
        this.usuarioObj = null;

        if (m.maquina) {
          this.maquinariaService.getMaquinariaById(m.maquina).subscribe({
            next: (mq) => (this.maquinaObj = mq),
            error: () => (this.maquinaObj = null),
          });
        }

        if (m.usuario) {
          this.usuarioService.getUsuarioById(m.usuario).subscribe({
            next: (u) => (this.usuarioObj = u),
            error: () => (this.usuarioObj = null),
          });
        }

        this.cargando = false;
      },
      error: () => {
        this.message.showWarning('No se pudo cargar el mantenimiento.');
        this.cargando = false;
      },
    });
  }

  // -------------------------------------------------------
  // EDICIÓN (PATCH PARCIAL)
  // -------------------------------------------------------
  activarEdicion(): void {
    if (!this.mantenimiento) return;
    this.modoEdicion = true;
    this.errores = {};
    this.originalForm = JSON.parse(JSON.stringify(this.form));
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errores = {};
    this.form = JSON.parse(JSON.stringify(this.originalForm));
  }

  // -------------------------------------------------------
  // OBTENER SOLO LOS CAMBIOS REALES
  // -------------------------------------------------------
  private obtenerCambios(): Partial<Mantenimiento> {
    const cambios: Partial<Mantenimiento> = {};

    const campos: (keyof Partial<Mantenimiento>)[] = [
      'descripcion',
      'fecha_mantenimiento',
      'horas_realizadas',
      'costo',
    ];

    campos.forEach((campo) => {
      const actual = this.form[campo];
      const original = this.originalForm[campo];

      // NUMÉRICOS
      if (campo === 'horas_realizadas' || campo === 'costo') {
        const nActual = actual == null ? null : Number(actual);
        const nOriginal = original == null ? null : Number(original);

        if (nActual !== nOriginal) {
          cambios[campo] = nActual as any;
        }
        return;
      }

      // FECHA
      if (campo === 'fecha_mantenimiento') {
        if (actual !== original) {
          cambios[campo] = actual as any;
        }
        return;
      }

      // STRING
      const sActual = (actual ?? '').toString().trim();
      const sOriginal = (original ?? '').toString().trim();

      if (sActual !== sOriginal && sActual !== '') {
        cambios[campo] = sActual as any;
      }
    });

    return cambios;
  }

  // -------------------------------------------------------
  // VALIDAR SOLO LO QUE SE ENVÍA
  // -------------------------------------------------------
  private validarParcial(cambios: Partial<Mantenimiento>): boolean {
    this.errores = {};

    if ('descripcion' in cambios) {
      const d = (cambios.descripcion ?? '').toString().trim();
      if (d.length < 3) {
        this.errores['descripcion'] = 'La descripción debe tener al menos 3 caracteres.';
      }
    }

    if ('fecha_mantenimiento' in cambios) {
      if (isNaN(Date.parse(String(cambios.fecha_mantenimiento)))) {
        this.errores['fecha_mantenimiento'] = 'Fecha inválida.';
      }
    }

    if ('horas_realizadas' in cambios) {
      const hv = Number(cambios.horas_realizadas);
      if (isNaN(hv) || hv < 0) {
        this.errores['horas_realizadas'] = 'Horas inválidas.';
      }
    }

    if ('costo' in cambios) {
      const cv = Number(cambios.costo);
      if (isNaN(cv) || cv < 0) {
        this.errores['costo'] = 'Costo inválido.';
      }
    }

    return Object.keys(this.errores).length === 0;
  }

  // -------------------------------------------------------
  // GUARDAR (PATCH REAL CON FORMDATA)
  // -------------------------------------------------------
  guardarCambios(): void {
    if (!this.id_mantenimiento) return;

    const cambios = this.obtenerCambios();

    if (Object.keys(cambios).length === 0) {
      this.message.showWarning('No hay cambios para guardar.');
      return;
    }

    if (!this.validarParcial(cambios)) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    this.cargandoOperacion = true;

    this.mantenimientoService.actualizar(this.id_mantenimiento, cambios).subscribe({
      next: () => {
        this.cargandoOperacion = false;
        this.message.showWarning('Mantenimiento actualizado correctamente.');
        this.modoEdicion = false;
        this.cargarMantenimiento();
      },
      error: (err) => {
        this.cargandoOperacion = false;

        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
          this.message.showWarning('Error en los datos enviados.');
        } else {
          this.message.showWarning('Error al actualizar el mantenimiento.');
        }
      },
    });
  }

  // -------------------------------------------------------
  // ELIMINAR
  // -------------------------------------------------------
  confirmarEliminar(): void {
    this.mostrarConfirmacionEliminar = true;
  }

  cancelarEliminacion(): void {
    this.mostrarConfirmacionEliminar = false;
  }

  eliminarMantenimiento(): void {
    if (!this.id_mantenimiento || !this.mantenimiento) return;

    this.cargandoEliminacion = true;
    this.mantenimientoService.eliminar(this.id_mantenimiento).subscribe({
      next: () => {
        this.cargandoEliminacion = false;
        this.message.showWarning('Mantenimiento eliminado.');

        const id_maquina = this.mantenimiento?.maquina;
        this.router.navigate(
          id_maquina ? ['/detalles-maquinaria-admin', id_maquina] : ['/ver-mantenimientos-admin']
        );
      },
      error: () => {
        this.cargandoEliminacion = false;
        this.message.showWarning('No se pudo eliminar el mantenimiento.');
        this.mostrarConfirmacionEliminar = false;
      },
    });
  }

  navegarALista(): void {
    this.router.navigate(['/ver-mantenimientos-admin']);
  }

  obtenerFotoUrl(foto?: string | null): string {
    if (!foto) return '/assets/images/mantenimiento-default.jpg';

    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    return `${baseUrl}${foto}`;
  }
}
