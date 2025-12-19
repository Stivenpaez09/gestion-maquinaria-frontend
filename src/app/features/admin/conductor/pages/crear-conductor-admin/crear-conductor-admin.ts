import { Component } from '@angular/core';
import { Usuario } from '../../../../../core/models/usuario.models';
import { ConductorCreate } from '../../../../../core/models/conductor.models';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { ConductorService } from '../../../../../core/services/conductor.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-crear-conductor-admin',
  imports: [RouterLink, FormsModule, CommonModule, SidebarAdmin],
  templateUrl: './crear-conductor-admin.html',
  styleUrl: './crear-conductor-admin.scss',
})
export class CrearConductorAdmin {
  usuarios: Usuario[] = [];
  cargandoUsuarios = false;

  // form
  form: Partial<ConductorCreate> = {
    usuario: undefined,
    licencia: '',
    fecha_vencimiento: '',
    licencia_vencida: false,
  };

  errores: Record<string, string> = {};
  creando = false;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private conductorService: ConductorService,
    private message: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  salir(): void {
    this.authService.logout();
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (list) => {
        this.usuarios = list || [];
        this.cargandoUsuarios = false;
      },
      error: (err) => {
        this.cargandoUsuarios = false;
        console.error('Error cargar usuarios', err);
        this.message.showWarning('No se pudieron cargar los usuarios.');
      },
    });
  }

  validarFormulario(): boolean {
    this.errores = {};

    if (!this.form.usuario) {
      this.errores['usuario'] = 'El usuario es obligatorio.';
    }

    const licencia = (this.form.licencia || '').trim();
    if (!licencia) this.errores['licencia'] = 'La licencia es obligatoria.';
    else if (licencia.length < 3 || licencia.length > 50)
      this.errores['licencia'] = 'La licencia debe tener entre 3 y 50 caracteres.';

    if (!this.form.fecha_vencimiento)
      this.errores['fecha_vencimiento'] = 'La fecha de vencimiento es obligatoria.';
    else {
      const fecha = new Date(this.form.fecha_vencimiento as string);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (isNaN(fecha.getTime())) this.errores['fecha_vencimiento'] = 'Fecha inválida.';
      else if (fecha < hoy)
        this.errores['fecha_vencimiento'] = 'La fecha de vencimiento no puede ser anterior a hoy.';
    }

    if (this.form.licencia_vencida === undefined || this.form.licencia_vencida === null) {
      this.errores['licencia_vencida'] = 'Debe especificar si la licencia está vencida.';
    } else {
      const fecha = new Date(this.form.fecha_vencimiento as string);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (!isNaN(fecha.getTime()) && this.form.licencia_vencida === true && fecha >= hoy) {
        this.errores['licencia_vencida'] =
          'No puede marcar la licencia como vencida si la fecha de vencimiento aún no ha pasado.';
      }
    }

    const ok = Object.keys(this.errores).length === 0;
    if (!ok) this.message.showWarning('Corrige los errores del formulario.');
    return ok;
  }

  crearConductor(): void {
    if (!this.validarFormulario()) return;

    const payload: ConductorCreate = {
      usuario: Number(this.form.usuario),
      licencia: String((this.form.licencia || '').trim()),
      fecha_vencimiento: String(this.form.fecha_vencimiento),
      licencia_vencida: Boolean(this.form.licencia_vencida),
    };

    this.creando = true;
    this.conductorService.crear(payload).subscribe({
      next: (c) => {
        this.creando = false;
        this.message.showWarning('Conductor creado correctamente.');
        this.form = {
          usuario: undefined,
          licencia: '',
          fecha_vencimiento: '',
          licencia_vencida: false,
        };
        this.router.navigate(['/ver-conductores-admin']);
      },
      error: (err) => {
        this.creando = false;
        console.error('Error crear conductor', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
        }
        this.message.showWarning('No se pudo crear el conductor.');
      },
    });
  }
}
