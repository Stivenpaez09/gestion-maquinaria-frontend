import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { ConductorService } from '../../../../../core/services/conductor.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Conductor } from '../../../../../core/models/conductor.models';
import { Usuario } from '../../../../../core/models/usuario.models';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-detalles-conductor-admin',
  imports: [CommonModule, FormsModule, SidebarAdmin],
  templateUrl: './detalles-conductor-admin.html',
  styleUrl: './detalles-conductor-admin.scss',
})
export class DetallesConductorAdmin implements OnInit {
  conductor?: Conductor;
  usuario?: Usuario;
  cargando = false;

  modoEdicion = false;
  guardando = false;
  cargandoUsuario = false;

  form: Partial<Pick<Conductor, 'licencia' | 'fecha_vencimiento' | 'licencia_vencida'>> = {
    licencia: '',
    fecha_vencimiento: '',
    licencia_vencida: false,
  };

  errores: Record<string, string> = {};
  private idConductor: number | null = null;

  constructor(
    private authService: AuthService,
    private conductorService: ConductorService,
    private usuarioService: UsuarioService,
    private message: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/ver-conductores-admin']);
      return;
    }
    this.idConductor = Number(id);
    this.cargarConductor();
  }

  salir(): void {
    this.authService.logout();
  }

  private cargarConductor(): void {
    if (!this.idConductor) return;
    this.cargando = true;
    this.conductorService.obtener(this.idConductor).subscribe({
      next: (c) => {
        this.conductor = c;
        this.cargando = false;
        this.cargarUsuario(c.usuario);
      },
      error: (err) => {
        console.error('Error cargar conductor', err);
        this.cargando = false;
        this.message.showWarning?.('No se pudo cargar el conductor.');
        this.router.navigate(['/ver-conductores-admin']);
      },
    });
  }

  private cargarUsuario(idUsuario: number): void {
    this.cargandoUsuario = true;
    this.usuarioService.getUsuarioById(idUsuario).subscribe({
      next: (u) => {
        this.usuario = u;
        this.cargandoUsuario = false;
      },
      error: () => {
        this.cargandoUsuario = false;
      },
    });
  }

  activarEdicion(): void {
    if (!this.conductor) return;
    this.errores = {};
    this.modoEdicion = true;
    this.form = {
      licencia: this.conductor.licencia,
      fecha_vencimiento: this.conductor.fecha_vencimiento,
      licencia_vencida: this.conductor.licencia_vencida,
    };
    // hide details view (template handles)
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errores = {};
    if (this.conductor) {
      this.form = {
        licencia: this.conductor.licencia,
        fecha_vencimiento: this.conductor.fecha_vencimiento,
        licencia_vencida: this.conductor.licencia_vencida,
      };
    }
  }

  private validarLocal(): boolean {
    this.errores = {};
    const licencia = (this.form.licencia || '').trim();
    const fecha = this.form.fecha_vencimiento;
    const vencida = !!this.form.licencia_vencida;

    if (!licencia) this.errores['licencia'] = 'La licencia es obligatoria.';
    else if (licencia.length < 3 || licencia.length > 50)
      this.errores['licencia'] = 'La licencia debe tener entre 3 y 50 caracteres.';

    if (!fecha) this.errores['fecha_vencimiento'] = 'La fecha de vencimiento es obligatoria.';
    else {
      const d = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (isNaN(d.getTime())) this.errores['fecha_vencimiento'] = 'Fecha inválida.';
      else if (d < hoy)
        this.errores['fecha_vencimiento'] = 'La fecha de vencimiento no puede ser anterior a hoy.';
    }

    if (!this.errores['fecha_vencimiento'] && vencida && fecha) {
      const d = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (d >= hoy) {
        this.errores['licencia_vencida'] =
          'No puede marcar la licencia como vencida si la fecha de vencimiento aún no pasó.';
      }
    }

    return Object.keys(this.errores).length === 0;
  }

  guardarCambios(): void {
    if (!this.conductor || !this.idConductor) return;
    if (!this.validarLocal()) {
      this.message.showWarning?.('Corrige los errores del formulario.');
      return;
    }

    const payload: Partial<typeof this.form> = {};
    const campos: (keyof typeof this.form)[] = [
      'licencia',
      'fecha_vencimiento',
      'licencia_vencida',
    ];
    for (const k of campos) {
      const nuevo = (this.form as any)[k];
      const viejo = (this.conductor as any)[k];
      // strict comparison but consider string/boolean coercion
      if (nuevo !== undefined && String(nuevo) !== String(viejo)) {
        (payload as any)[k] = nuevo;
      }
    }

    if (Object.keys(payload).length === 0) {
      this.modoEdicion = false;
      return;
    }

    this.guardando = true;
    this.conductorService.actualizar(this.idConductor, payload).subscribe({
      next: (updated) => {
        this.conductor = { ...this.conductor!, ...updated };
        this.modoEdicion = false;
        this.guardando = false;
        this.errores = {};
        this.message.showWarning('Conductor actualizado correctamente.');
      },
      error: (err) => {
        this.guardando = false;
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
        }
        this.message.showWarning?.('No se pudo actualizar el conductor.');
      },
    });
  }

  eliminarConductor(): void {
    if (!this.conductor || !this.idConductor) return;
    if (!confirm('¿Eliminar este conductor? Esta acción no se puede deshacer.')) return;
    this.conductorService.eliminar(this.idConductor).subscribe({
      next: () => {
        this.message.showWarning('Conductor eliminado.');
        this.router.navigate(['/ver-conductores-admin']);
      },
      error: () => {
        this.message.showWarning?.('No se pudo eliminar el conductor.');
      },
    });
  }

  verDetalleUsuario(): void {
    if (!this.usuario) return;
    this.router.navigate(['/detalles-usuario-admin', this.usuario.id_usuario]);
  }

  volver(): void {
    this.router.navigate(['/ver-conductores-admin']);
  }
}
