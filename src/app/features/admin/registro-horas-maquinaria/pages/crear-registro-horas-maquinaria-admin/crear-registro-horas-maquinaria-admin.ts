import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../../core/services/auth.service';
import { RegistroHorasMaquinariaService } from '../../../../../core/services/registro-horas-maquinaria.service';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { ProyectoService } from '../../../../../core/services/proyecto.service';
import { MessageService } from '../../../../../core/services/message.service';

import { RegistroHorasMaquinariaCreate } from '../../../../../core/models/registro-horas-maquinaria';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { Usuario } from '../../../../../core/models/usuario.models';
import { Proyecto } from '../../../../../core/models/proyecto.models';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-crear-registro-horas-maquinaria-admin',
  imports: [CommonModule, FormsModule, SidebarAdmin],
  templateUrl: './crear-registro-horas-maquinaria-admin.html',
  styleUrl: './crear-registro-horas-maquinaria-admin.scss',
})
export class CrearRegistroHorasMaquinariaAdmin implements OnInit {
  maquinas: Maquinaria[] = [];
  usuarios: Usuario[] = [];
  proyectos: Proyecto[] = [];

  cargandoListas = false;
  creando = false;

  // previews / files
  fotoPlanillaPreview: string | null = null;
  fotoPlanillaFile: File | null = null;

  fotoHorometroInicialPreview: string | null = null;
  fotoHorometroInicialFile: File | null = null;

  fotoHorometroFinalPreview: string | null = null;
  fotoHorometroFinalFile: File | null = null;

  // formulario obligatorio: todas las FK obligatorias en front
  form: Partial<RegistroHorasMaquinariaCreate> = {
    maquina: undefined,
    proyecto: null,
    usuario: undefined,
    fecha: '',
    horas_trabajadas: 0,
    observaciones: '',
    foto_planilla: null,
    foto_horometro_inicial: null,
    foto_horometro_final: null,
  };

  errores: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private registroService: RegistroHorasMaquinariaService,
    private maquinariaService: MaquinariaService,
    private usuarioService: UsuarioService,
    private proyectoService: ProyectoService,
    private message: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarListas();
  }

  cargarListas(): void {
    this.cargandoListas = true;

    this.maquinariaService.getMaquinarias().subscribe({
      next: (m) => (this.maquinas = m),
      error: (e) => {
        console.error('Error cargar maquinas', e);
        this.message.showWarning('No se pudieron cargar las máquinas.');
      },
    });

    this.usuarioService.getUsuarios().subscribe({
      next: (u) => (this.usuarios = u),
      error: (e) => {
        console.error('Error cargar usuarios', e);
        this.message.showWarning('No se pudieron cargar los usuarios.');
      },
    });

    this.proyectoService.getProyectos().subscribe({
      next: (p) => (this.proyectos = p),
      error: (e) => {
        console.error('Error cargar proyectos', e);
        this.message.showWarning('No se pudieron cargar los proyectos.');
      },
      complete: () => (this.cargandoListas = false),
    });
  }

  onFileSelected(
    field: 'foto_planilla' | 'foto_horometro_inicial' | 'foto_horometro_final',
    evt: Event
  ): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      this.message.showWarning('Formato de imagen no permitido. Use JPG, PNG o WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.message.showWarning('La imagen excede el tamaño máximo (5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      if (field === 'foto_planilla') {
        this.fotoPlanillaFile = file;
        this.fotoPlanillaPreview = url;
      } else if (field === 'foto_horometro_inicial') {
        this.fotoHorometroInicialFile = file;
        this.fotoHorometroInicialPreview = url;
      } else {
        this.fotoHorometroFinalFile = file;
        this.fotoHorometroFinalPreview = url;
      }
    };
    reader.readAsDataURL(file);
  }

  limpiarFoto(field: 'foto_planilla' | 'foto_horometro_inicial' | 'foto_horometro_final'): void {
    if (field === 'foto_planilla') {
      this.fotoPlanillaFile = null;
      this.fotoPlanillaPreview = null;
      this.form.foto_planilla = null;
    } else if (field === 'foto_horometro_inicial') {
      this.fotoHorometroInicialFile = null;
      this.fotoHorometroInicialPreview = null;
      this.form.foto_horometro_inicial = null;
    } else {
      this.fotoHorometroFinalFile = null;
      this.fotoHorometroFinalPreview = null;
      this.form.foto_horometro_final = null;
    }
  }

  private validar(): boolean {
    this.errores = {};

    // FK obligatorias en front: maquina, usuario, proyecto (user asked all FK required)
    if (!this.form.maquina) {
      this.errores['maquina'] = 'Seleccione una máquina.';
    } else {
      const maquina = this.maquinas.find((m) => m.id_maquina === Number(this.form.maquina));
      if (maquina && maquina.estado === 'fuera de servicio') {
        this.errores['maquina'] = 'La máquina está fuera de servicio.';
      }
    }

    if (this.form.proyecto === null || this.form.proyecto === undefined) {
      this.errores['proyecto'] = 'Seleccione un proyecto.';
    } else {
      const proyectoExists = this.proyectos.find(
        (p) => p.id_proyecto === Number(this.form.proyecto)
      );
      if (!proyectoExists) {
        this.errores['proyecto'] = 'Proyecto inválido.';
      }
    }

    if (!this.form.usuario) {
      this.errores['usuario'] = 'Seleccione un usuario.';
    } else {
      const usr = this.usuarios.find((u) => u.id_usuario === Number(this.form.usuario));
      if (!usr) {
        this.errores['usuario'] = 'Usuario inválido.';
      }
    }

    // fecha obligatoria y no futura
    if (!this.form.fecha) {
      this.errores['fecha'] = 'La fecha es obligatoria.';
    } else {
      const d = new Date(String(this.form.fecha));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(d.getTime())) {
        this.errores['fecha'] = 'Fecha inválida.';
      } else if (d > today) {
        this.errores['fecha'] = 'La fecha no puede ser futura.';
      }
    }

    // horas trabajadas > 0
    const horas = Number(this.form.horas_trabajadas);
    if (Number.isNaN(horas) || horas <= 0) {
      this.errores['horas_trabajadas'] = 'Ingrese horas trabajadas mayores a 0.';
    }

    // observaciones max 2000
    if (this.form.observaciones && String(this.form.observaciones).length > 2000) {
      this.errores['observaciones'] = 'Observaciones: máximo 2000 caracteres.';
    }

    return Object.keys(this.errores).length === 0;
  }

  crearRegistro(): void {
    if (!this.validar()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    const payload: Partial<RegistroHorasMaquinariaCreate> = {
      maquina: Number(this.form.maquina),
      proyecto: Number(this.form.proyecto),
      usuario: Number(this.form.usuario),
      fecha: String(this.form.fecha),
      horas_trabajadas: Number(this.form.horas_trabajadas),
      observaciones: this.form.observaciones ? String(this.form.observaciones).trim() : undefined,
    };

    // adjuntar archivos si existen (service buildFormData maneja File)
    if (this.fotoPlanillaFile) {
      (payload as any).foto_planilla = this.fotoPlanillaFile;
    }
    if (this.fotoHorometroInicialFile) {
      (payload as any).foto_horometro_inicial = this.fotoHorometroInicialFile;
    }
    if (this.fotoHorometroFinalFile) {
      (payload as any).foto_horometro_final = this.fotoHorometroFinalFile;
    }

    this.creando = true;
    this.registroService.crear(payload as RegistroHorasMaquinariaCreate).subscribe({
      next: (res) => {
        this.creando = false;
        this.message.showWarning('Registro creado correctamente.');
        this.router.navigate(['/ver-registros-horas-maquinaria-admin']);
      },
      error: (err) => {
        this.creando = false;
        console.error('Error crear registro', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
          this.message.showWarning('Corrige los errores y reintenta.');
        } else {
          this.message.showWarning('No se pudo crear el registro.');
        }
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/ver-registros-horas-maquinaria-admin']);
  }

  salir(): void {
    this.authService.logout();
  }
}
