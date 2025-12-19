import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../../../../core/services/curso.service';
import { Curso, CursoCreate } from '../../../../../core/models/curso.models';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { Usuario } from '../../../../../core/models/usuario.models';
import { MessageService } from '../../../../../core/services/message.service';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-detalles-curso-admin',
  imports: [CommonModule, FormsModule, SidebarAdmin],
  templateUrl: './detalles-curso-admin.html',
  styleUrl: './detalles-curso-admin.scss',
})
export class DetallesCursoAdmin implements OnInit {
  usuario?: Usuario;
  curso?: Curso;
  cargando = false;
  modoEdicion = false;
  guardando = false;
  errores: Record<string, string> = {};

  // form editable (no id_curso, no usuario)
  editForm: Partial<CursoCreate> = {
    nombre_curso: '',
    institucion: '',
    fecha_inicio: '',
    fecha_fin: '',
    usuario: undefined,
  };

  private idCurso: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/ver-cursos-admin']);
      return;
    }
    this.idCurso = Number(idParam);
    this.cargarCurso();
  }

  salir(): void {
    this.authService.logout();
  }

  cargarCurso(): void {
    if (!this.idCurso) return;
    this.cargando = true;
    this.cursoService.obtener(this.idCurso).subscribe({
      next: (c) => {
        this.curso = c;
        // preparar formulario con valores actuales
        this.editForm = {
          nombre_curso: c.nombre_curso,
          institucion: c.institucion,
          fecha_inicio: c.fecha_inicio,
          fecha_fin: c.fecha_fin,
          usuario: c.usuario,
        };
        this.cargando = false;
        this.obtenerUsuario();
      },
      error: () => {
        this.cargando = false;
        // si falla, volver atrás
        this.router.navigate(['/ver-cursos-admin']);
      },
    });
  }

  activarEdicion(): void {
    if (!this.curso) return;
    this.errores = {};
    this.modoEdicion = true;
    // asegurarse que editForm contenga los valores actuales
    this.editForm = {
      nombre_curso: this.curso.nombre_curso,
      institucion: this.curso.institucion,
      fecha_inicio: this.curso.fecha_inicio,
      fecha_fin: this.curso.fecha_fin,
      usuario: this.curso.usuario,
    };
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errores = {};
    if (this.curso) {
      this.editForm = {
        nombre_curso: this.curso.nombre_curso,
        institucion: this.curso.institucion,
        fecha_inicio: this.curso.fecha_inicio,
        fecha_fin: this.curso.fecha_fin,
        usuario: this.curso.usuario,
      };
    }
  }

  private validarLocal(): boolean {
    this.errores = {};
    const nombre = (this.editForm.nombre_curso || '').trim();
    const institucion = (this.editForm.institucion || '').trim();
    const inicio = this.editForm.fecha_inicio;
    const fin = this.editForm.fecha_fin;

    if (!nombre) this.errores['nombre_curso'] = 'El nombre del curso es obligatorio.';
    else if (nombre.length < 3 || nombre.length > 150)
      this.errores['nombre_curso'] = 'Debe tener entre 3 y 150 caracteres.';

    if (!institucion) this.errores['institucion'] = 'La institución es obligatoria.';
    else if (institucion.length < 3 || institucion.length > 150)
      this.errores['institucion'] = 'Debe tener entre 3 y 150 caracteres.';

    if (!inicio) this.errores['fecha_inicio'] = 'La fecha de inicio es obligatoria.';
    else if (isNaN(new Date(inicio).getTime()))
      this.errores['fecha_inicio'] = 'Fecha inicio inválida.';
    else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (new Date(inicio) > hoy)
        this.errores['fecha_inicio'] = 'La fecha de inicio no puede ser futura.';
    }

    if (!fin) this.errores['fecha_fin'] = 'La fecha de fin es obligatoria.';
    else if (isNaN(new Date(fin).getTime())) this.errores['fecha_fin'] = 'Fecha fin inválida.';
    else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (new Date(fin) > hoy) this.errores['fecha_fin'] = 'La fecha de fin no puede ser futura.';
    }

    if (!this.errores['fecha_inicio'] && !this.errores['fecha_fin']) {
      const dI = new Date(inicio!);
      const dF = new Date(fin!);
      if (dF < dI)
        this.errores['fecha_fin'] = 'La fecha de fin no puede ser anterior a la de inicio.';
      else if (dF.getFullYear() - dI.getFullYear() > 10)
        this.errores['fecha_fin'] = 'Un curso no puede durar más de 10 años.';
    }

    return Object.keys(this.errores).length === 0;
  }

  obtenerUsuario(): void {
    if (!this.curso) return;
    this.usuarioService.getUsuarioById(this.curso.usuario).subscribe({
      next: (u) => {
        this.usuario = u;
      },
      error: () => {
        this.message.showWarning('No se pudo cargar la información del usuario asociado.');
      },
    });
  }

  guardarCambios(): void {
    if (!this.curso || !this.idCurso) return;

    // validar localmente
    if (!this.validarLocal()) return;

    // construir payload con solo campos modificados
    const payload: Partial<CursoCreate> = {};
    const campos: (keyof CursoCreate)[] = [
      'nombre_curso',
      'institucion',
      'fecha_inicio',
      'fecha_fin',
    ];
    for (const k of campos) {
      const nuevo = (this.editForm as any)[k];
      const viejo = (this.curso as any)[k];
      if (nuevo !== undefined && String(nuevo) !== String(viejo)) {
        (payload as any)[k] = nuevo;
      }
    }

    if (Object.keys(payload).length === 0) {
      // nada que actualizar
      this.modoEdicion = false;
      return;
    }

    this.guardando = true;
    this.cursoService.actualizar(this.idCurso, payload).subscribe({
      next: (updated) => {
        // merge cambios locales con el curso actual
        this.curso = { ...this.curso!, ...updated };
        this.modoEdicion = false;
        this.guardando = false;
        this.errores = {};
      },
      error: (err) => {
        this.guardando = false;
        // mapear errores del backend si vienen
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
        }
      },
    });
  }

  eliminarCurso(): void {
    if (!this.curso || !this.idCurso) return;
    const ok = window.confirm('¿Eliminar este curso? Esta acción no se puede deshacer.');
    if (!ok) return;
    this.cursoService.eliminar(this.idCurso).subscribe({
      next: () => {
        // volver a detalles de usuario
        this.router.navigate(['/detalles-usuario-admin', this.curso!.usuario]);
      },
      error: () => {
        // no mostrar detalles extensos, mantener en la misma vista
        alert('No se pudo eliminar el curso.');
      },
    });
  }

  volver(): void {
    const usuarioId = this.curso?.usuario ?? null;
    if (usuarioId) this.router.navigate(['/detalles-usuario-admin', usuarioId]);
    else this.router.navigate(['/ver-cursos-admin']);
  }
}
