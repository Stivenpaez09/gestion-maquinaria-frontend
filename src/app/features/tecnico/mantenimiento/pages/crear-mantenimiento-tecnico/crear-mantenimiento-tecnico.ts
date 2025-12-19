import { Component } from '@angular/core';
import { SidebarTecnico } from '../../../../../shared/components/sidebar-tecnico/sidebar-tecnico';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { Usuario } from '../../../../../core/models/usuario.models';
import { MantenimientoProgramado } from '../../../../../core/models/mantenimiento-programado.models';
import { MantenimientoCreate } from '../../../../../core/models/mantenimiento-models';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MantenimientoProgramadoService } from '../../../../../core/services/mantenimiento-programado.service';
import { MantenimientoService } from '../../../../../core/services/mantenimiento.service';
import { MessageService } from '../../../../../core/services/message.service';

@Component({
  selector: 'app-crear-mantenimiento-tecnico',
  imports: [CommonModule, FormsModule, RouterLink, SidebarTecnico],
  templateUrl: './crear-mantenimiento-tecnico.html',
  styleUrl: './crear-mantenimiento-tecnico.scss',
})
export class CrearMantenimientoTecnico {
  // listas para selects
  maquinas: Maquinaria[] = [];
  usuarios: Usuario[] = [];
  programados: MantenimientoProgramado[] = [];

  // flags
  cargando = false;
  cargandoListas = false;
  creando = false;

  // preview foto
  fotoPreview: string | null = null;
  fotoFile: File | null = null;
  fotoNombre: string | null = null;

  // formulario
  form: Partial<MantenimientoCreate> = {
    maquina: undefined,
    programado: null,
    usuario: null,
    tipo_mantenimiento: 'preventivo',
    descripcion: '',
    fecha_mantenimiento: '',
    horas_realizadas: 0,
    costo: 0,
    foto: null,
  };

  // errores de validación
  errores: { [key: string]: string } = {};

  constructor(
    private maquinariaService: MaquinariaService,
    private usuarioService: UsuarioService,
    private programadoService: MantenimientoProgramadoService,
    private mantenimientoService: MantenimientoService,
    private message: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarListas();
  }

  private cargarListas(): void {
    this.cargandoListas = true;
    // cargar máquinas
    this.maquinariaService.getMaquinarias().subscribe({
      next: (m) => (this.maquinas = m),
      error: (e) => {
        console.error('Error cargar maquinas', e);
        this.message.showWarning('No se pudieron cargar las máquinas.');
      },
    });

    // cargar usuarios
    this.usuarioService.getUsuarios().subscribe({
      next: (u) => (this.usuarios = u),
      error: (e) => {
        console.error('Error cargar usuarios', e);
        this.message.showWarning('No se pudieron cargar los usuarios.');
      },
    });

    // cargar mantenimientos programados
    this.programadoService.listar().subscribe({
      next: (p) => (this.programados = p),
      error: (e) => {
        console.error('Error cargar programados', e);
        this.message.showWarning('No se pudieron cargar los mantenimientos programados.');
      },
      complete: () => (this.cargandoListas = false),
    });
  }

  onFotoSeleccionada(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    // validaciones básicas
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      this.message.showWarning('Formato de imagen no permitido. Use JPG, PNG o WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.message.showWarning('La imagen excede el tamaño máximo (5MB).');
      return;
    }
    this.fotoFile = file;
    this.fotoNombre = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoPreview = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  limpiarFoto(): void {
    this.fotoFile = null;
    this.fotoPreview = null;
    this.fotoNombre = null;
    this.form.foto = null;
  }

  private validar(): boolean {
    this.errores = {};
    // maquina
    if (!this.form.maquina) {
      this.errores['maquina'] = 'Seleccione la máquina (obligatorio).';
    }
    // tipo
    const tipos = ['preventivo', 'correctivo', 'predictivo'];
    if (!this.form.tipo_mantenimiento || !tipos.includes(String(this.form.tipo_mantenimiento))) {
      this.errores['tipo_mantenimiento'] = 'Seleccione un tipo válido.';
    }
    // descripcion
    if (!this.form.descripcion || String(this.form.descripcion).trim().length === 0) {
      this.errores['descripcion'] = 'La descripción es obligatoria.';
    } else if (String(this.form.descripcion).trim().length < 3) {
      this.errores['descripcion'] = 'La descripción es demasiado corta.';
    }

    // fecha
    if (!this.form.fecha_mantenimiento) {
      this.errores['fecha_mantenimiento'] = 'La fecha es obligatoria.';
    } else {
      const d = new Date(String(this.form.fecha_mantenimiento));
      if (isNaN(d.getTime())) {
        this.errores['fecha_mantenimiento'] = 'Fecha inválida.';
      }
    }

    // horas_realizadas
    const horas = Number(this.form.horas_realizadas);
    if (Number.isNaN(horas) || horas < 0) {
      this.errores['horas_realizadas'] = 'Horas inválidas.';
    } else if (horas > 1000000000) {
      this.errores['horas_realizadas'] = 'Horas fuera de rango.';
    }

    // costo
    const costo = Number(this.form.costo);
    if (Number.isNaN(costo) || costo < 0) {
      this.errores['costo'] = 'Costo inválido.';
    }

    // programado -> si seleccionado debe existir en lista (optional)
    if (this.form.programado !== null && this.form.programado !== undefined) {
      const idProg = Number(this.form.programado);
      if (idProg !== 0 && !this.programados.find((p) => p.id_programado === idProg)) {
        this.errores['programado'] = 'Mantenimiento programado no válido.';
      }
    }

    return Object.keys(this.errores).length === 0;
  }

  crearMantenimiento(): void {
    if (!this.validar()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    const payload: any = {
      maquina: Number(this.form.maquina),
      programado: this.form.programado ? Number(this.form.programado) : null,
      usuario: this.form.usuario ? Number(this.form.usuario) : null,
      tipo_mantenimiento: String(this.form.tipo_mantenimiento),
      descripcion: String(this.form.descripcion).trim(),
      fecha_mantenimiento: String(this.form.fecha_mantenimiento),
      horas_realizadas: Number(this.form.horas_realizadas),
      costo: Number(this.form.costo),
    };

    // si hay foto, la adjuntamos (service construye FormData internamente)
    if (this.fotoFile) {
      payload.foto = this.fotoFile as any;
    }

    this.creando = true;
    this.mantenimientoService.crear(payload).subscribe({
      next: (res) => {
        this.creando = false;
        this.message.showWarning('Mantenimiento creado correctamente.');
        this.router.navigate(['/ver-mantenimientos-tecnico']);
      },
      error: (err) => {
        this.creando = false;
        console.error('Error crear mantenimiento', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
        } else {
          this.message.showWarning('Error al crear mantenimiento.');
        }
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/ver-mantenimientos-tecnico']);
  }
}
