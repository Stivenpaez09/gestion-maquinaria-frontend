import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Usuario } from '../../../../../core/models/usuario.models';
import { environment } from '../../../../../../environments/environment.prod';
import { Curso, CursoCreate } from '../../../../../core/models/curso.models';
import { CursoService } from '../../../../../core/services/curso.service';
import { LoginService } from '../../../../../core/services/login.service';
import { Login, LoginCreate } from '../../../../../core/models/login.models';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-detalles-usuario-admin',
  imports: [CommonModule, RouterLink, FormsModule, SidebarAdmin],
  templateUrl: './detalles-usuario-admin.html',
  styleUrl: './detalles-usuario-admin.scss',
})
export class DetallesUsuarioAdmin implements OnInit {
  // Datos principales
  usuario: Usuario | null = null;
  id_usuario: number | null = null;
  cargando: boolean = true;
  environment = environment;

  // Edición
  modoEdicion: boolean = false;
  usuarioOriginal: Partial<Usuario> = {};
  usuarioEditado: Partial<Usuario> = {};
  camposModificados: Set<string> = new Set();
  erroresEdicion: { [key: string]: string } = {};
  cargandoEdicion: boolean = false;

  // Eliminación
  mostrarConfirmacionEliminar: boolean = false;
  cargandoEliminacion: boolean = false;

  // Cursos
  cursos: Curso[] = [];
  cargandoCursos = false;
  mostrarModalCrearCurso = false;

  cursoForm: Partial<CursoCreate & { usuario?: number }> = {
    nombre_curso: '',
    institucion: '',
    fecha_inicio: '',
    fecha_fin: '',
    usuario: undefined,
  };

  erroresCurso: { [key: string]: string } = {};
  creandoCurso = false;

  // Login relacionado
  login: Login | null = null;
  cargandoLogin = false;

  // Nuevo: formulario inline para crear login
  mostrarFormularioCrearLogin = false;
  loginForm: Partial<LoginCreate> = {
    usuario: undefined,
    username: '',
    password: '',
    rol: 'OPERADOR',
    is_active: true,
  };
  erroresLogin: { [key: string]: string } = {};
  creandoLogin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private message: MessageService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.id_usuario = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id_usuario) {
      this.cargarUsuario();
    }
  }

  salir(): void {
    this.authService.logout();
  }

  // -------------------------------------------------------
  // CARGAR USUARIO
  // -------------------------------------------------------
  cargarUsuario(): void {
    if (!this.id_usuario) return;

    this.cargando = true;
    this.usuarioService.getUsuarioById(this.id_usuario).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.usuarioEditado = { ...usuario };
        this.cargando = false;
        if (this.usuario?.id_usuario) {
          this.cargarCursos(this.usuario.id_usuario);
          this.cargarLogin(this.usuario.id_usuario);
        }
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.message.showWarning('Error al cargar el usuario.');
        this.cargando = false;
      },
    });
  }

  // -------------------------------------------------------
  // Cursos relacionados al usuario
  // -------------------------------------------------------
  cargarCursos(idUsuario: number): void {
    this.cargandoCursos = true;
    this.cursoService.listarPorUsuario(idUsuario).subscribe({
      next: (list) => {
        this.cursos = list || [];
        this.cargandoCursos = false;
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
        this.message.showWarning('No se pudieron cargar los cursos.');
        this.cargandoCursos = false;
      },
    });
  }

  abrirModalCrearCurso(): void {
    this.erroresCurso = {};
    this.cursoForm = {
      nombre_curso: '',
      institucion: '',
      fecha_inicio: '',
      fecha_fin: '',
      usuario: this.usuario?.id_usuario || this.id_usuario || undefined,
    };
    this.mostrarModalCrearCurso = true;
  }

  cerrarModalCrearCurso(): void {
    this.mostrarModalCrearCurso = false;
    this.creandoCurso = false;
    this.erroresCurso = {};
  }

  private validarCurso(): boolean {
    this.erroresCurso = {};
    const nombre = (this.cursoForm.nombre_curso || '').trim();
    const institucion = (this.cursoForm.institucion || '').trim();
    const inicio = this.cursoForm.fecha_inicio;
    const fin = this.cursoForm.fecha_fin;

    if (!this.cursoForm.usuario) {
      this.erroresCurso['usuario'] = 'Usuario inválido.';
    }

    if (!nombre) {
      this.erroresCurso['nombre_curso'] = 'El nombre del curso es obligatorio.';
    } else if (nombre.length < 3 || nombre.length > 150) {
      this.erroresCurso['nombre_curso'] = 'El nombre debe tener entre 3 y 150 caracteres.';
    }

    if (!institucion) {
      this.erroresCurso['institucion'] = 'La institución es obligatoria.';
    } else if (institucion.length < 3 || institucion.length > 150) {
      this.erroresCurso['institucion'] = 'La institución debe tener entre 3 y 150 caracteres.';
    }

    if (!inicio) {
      this.erroresCurso['fecha_inicio'] = 'La fecha de inicio es obligatoria.';
    } else if (isNaN(new Date(inicio).getTime())) {
      this.erroresCurso['fecha_inicio'] = 'Fecha inicio inválida.';
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const d = new Date(inicio);
      if (d > hoy) this.erroresCurso['fecha_inicio'] = 'La fecha de inicio no puede ser futura.';
    }

    if (!fin) {
      this.erroresCurso['fecha_fin'] = 'La fecha de fin es obligatoria.';
    } else if (isNaN(new Date(fin).getTime())) {
      this.erroresCurso['fecha_fin'] = 'Fecha fin inválida.';
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const d = new Date(fin);
      if (d > hoy) this.erroresCurso['fecha_fin'] = 'La fecha de fin no puede ser futura.';
    }

    if (inicio && fin && !this.erroresCurso['fecha_inicio'] && !this.erroresCurso['fecha_fin']) {
      const dInicio = new Date(inicio);
      const dFin = new Date(fin);

      if (dFin < dInicio) {
        this.erroresCurso['fecha_fin'] = 'La fecha de fin no puede ser anterior a la de inicio.';
      } else {
        const anios = dFin.getFullYear() - dInicio.getFullYear();
        if (anios > 10) {
          this.erroresCurso['fecha_fin'] = 'Un curso no puede durar más de 10 años.';
        }
      }
    }
    return Object.keys(this.erroresCurso).length === 0;
  }

  crearCurso(): void {
    if (!this.validarCurso()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    const payload: CursoCreate = {
      usuario: Number(this.cursoForm.usuario),
      nombre_curso: String((this.cursoForm.nombre_curso || '').trim()),
      institucion: String((this.cursoForm.institucion || '').trim()),
      fecha_inicio: String(this.cursoForm.fecha_inicio),
      fecha_fin: String(this.cursoForm.fecha_fin),
    };

    this.creandoCurso = true;
    this.cursoService.crear(payload).subscribe({
      next: (curso) => {
        this.creandoCurso = false;
        this.message.showWarning('Curso creado correctamente.');
        this.cursos.unshift(curso);
        this.cerrarModalCrearCurso();
      },
      error: (err) => {
        this.creandoCurso = false;
        console.error('Error crear curso', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.erroresCurso[k] = Array.isArray(err.error[k])
              ? err.error[k][0]
              : String(err.error[k]);
          });
        }
        this.message.showWarning('No se pudo crear el curso.');
      },
    });
  }

  verDetalleCurso(id_curso: number): void {
    this.router.navigate(['/detalles-curso-admin', id_curso]);
  }

  // -------------------------------------------------------
  // EDICIÓN DE USUARIO
  // -------------------------------------------------------
  activarEdicion(): void {
    if (!this.usuario) return;
    this.modoEdicion = true;
    this.usuarioOriginal = { ...this.usuario };
    this.usuarioEditado = { ...this.usuario };
    this.camposModificados.clear();
    this.erroresEdicion = {};
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.usuarioEditado = { ...this.usuario };
    this.camposModificados.clear();
    this.erroresEdicion = {};
  }

  // Detectar cambios en cada campo
  onCampoModificado(nombreCampo: string): void {
    const valorOriginal = this.usuarioOriginal[nombreCampo as keyof Usuario];
    const valorActual = this.usuarioEditado[nombreCampo as keyof Usuario];

    // Comparar valores (manejar null/undefined)
    const original =
      valorOriginal === null || valorOriginal === undefined ? '' : String(valorOriginal).trim();
    const actual =
      valorActual === null || valorActual === undefined ? '' : String(valorActual).trim();

    if (original !== actual) {
      this.camposModificados.add(nombreCampo);
    } else {
      this.camposModificados.delete(nombreCampo);
    }
  }

  private validarEdicion(): boolean {
    this.erroresEdicion = {};

    // Validar solo los campos que fueron modificados
    if (this.camposModificados.has('nombre')) {
      const nombre = (this.usuarioEditado.nombre || '').trim();
      if (!nombre) {
        this.erroresEdicion['nombre'] = 'El nombre es obligatorio.';
      } else if (nombre.length < 3 || nombre.length > 100) {
        this.erroresEdicion['nombre'] = 'El nombre debe tener entre 3 y 100 caracteres.';
      }
    }

    // Removido: validación de cargo (ya no es editable)

    if (this.camposModificados.has('email')) {
      const email = (this.usuarioEditado.email || '').trim();
      if (!email) {
        this.erroresEdicion['email'] = 'El correo electrónico es obligatorio.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          this.erroresEdicion['email'] = 'Correo electrónico inválido.';
        }
      }
    }

    if (this.camposModificados.has('telefono')) {
      const telefono = (this.usuarioEditado.telefono || '').trim();
      if (!telefono) {
        this.erroresEdicion['telefono'] = 'El número de teléfono es obligatorio.';
      } else {
        const telefonoRegex = /^\d{7,15}$/;
        if (!telefonoRegex.test(telefono)) {
          this.erroresEdicion['telefono'] =
            'El teléfono debe contener entre 7 y 15 dígitos numéricos.';
        }
      }
    }

    if (this.camposModificados.has('fecha_ingreso')) {
      if (!this.usuarioEditado.fecha_ingreso) {
        this.erroresEdicion['fecha_ingreso'] = 'La fecha de ingreso es obligatoria.';
      } else {
        const fecha = new Date(this.usuarioEditado.fecha_ingreso);
        const hoy = new Date();
        hoy.setHours(23, 59, 59, 999);
        if (fecha > hoy) {
          this.erroresEdicion['fecha_ingreso'] = 'La fecha de ingreso no puede ser futura.';
        }
      }
    }

    return Object.keys(this.erroresEdicion).length === 0;
  }

  guardarEdicion(): void {
    if (this.camposModificados.size === 0) {
      this.message.showWarning('No hay cambios para guardar.');
      return;
    }

    if (!this.validarEdicion() || !this.id_usuario) {
      this.message.showWarning('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.cargandoEdicion = true;

    // Crear objeto solo con campos modificados
    const datosAActualizar: any = {};

    this.camposModificados.forEach((campo) => {
      const valor = this.usuarioEditado[campo as keyof Usuario];
      if (valor !== null && valor !== undefined) {
        datosAActualizar[campo] = typeof valor === 'string' ? valor.trim() : valor;
      } else if (campo === 'email' || campo === 'telefono' || campo === 'fecha_ingreso') {
        // Permitir null para campos opcionales
        datosAActualizar[campo] = null;
      }
    });

    this.usuarioService.patchUsuario(this.id_usuario, datosAActualizar).subscribe({
      next: (usuario) => {
        this.cargandoEdicion = false;
        this.message.showWarning('Usuario actualizado exitosamente.');
        this.usuario = usuario;
        this.usuarioEditado = { ...usuario };
        this.modoEdicion = false;
        this.camposModificados.clear();
      },
      error: (error) => {
        this.cargandoEdicion = false;
        console.error('Error al actualizar:', error);

        if (error.error && typeof error.error === 'object') {
          Object.keys(error.error).forEach((key) => {
            const mensaje = error.error[key];
            this.erroresEdicion[key] = Array.isArray(mensaje) ? mensaje[0] : String(mensaje);
          });
        }

        const mensajeError = Object.values(this.erroresEdicion).join('. ');
        this.message.showWarning(mensajeError || 'Error al actualizar el usuario.');
      },
    });
  }

  // -------------------------------------------------------
  // ELIMINACIÓN DE USUARIO
  // -------------------------------------------------------
  confirmarEliminar(): void {
    this.mostrarConfirmacionEliminar = true;
  }

  cancelarEliminacion(): void {
    this.mostrarConfirmacionEliminar = false;
  }

  eliminarUsuario(): void {
    if (!this.id_usuario) return;

    this.cargandoEliminacion = true;

    this.usuarioService.deleteUsuario(this.id_usuario).subscribe({
      next: () => {
        this.cargandoEliminacion = false;
        this.message.showWarning('Usuario eliminado exitosamente.');
        setTimeout(() => {
          this.router.navigate(['/ver-usuarios-admin']);
        }, 1500);
      },
      error: (error) => {
        this.cargandoEliminacion = false;
        console.error('Error al eliminar usuario:', error);
        this.message.showWarning(error.error?.detail || 'Error al eliminar el usuario.');
      },
    });
  }

  // -------------------------------------------------------
  // OBTENER URL DE FOTO
  // -------------------------------------------------------
  obtenerFotoUrl(foto: string | null | undefined): string {
    if (!foto) {
      return '/assets/images/operador.jpg';
    }
    if (foto.startsWith('http')) {
      return foto;
    }
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    const fotoPath = foto.startsWith('/') ? foto : `/${foto}`;
    return `${baseUrl}${fotoPath}`;
  }

  // -------------------------------------------------------
  // FORMATEAR FECHA
  // -------------------------------------------------------
  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  // -------------------------------------------------------
  // VERIFICAR ERRORES
  // -------------------------------------------------------
  tieneError(campo: string): boolean {
    return !!this.erroresEdicion[campo];
  }

  obtenerError(campo: string): string {
    return this.erroresEdicion[campo] || '';
  }

  // ---------------------------
  // LOGIN
  // ---------------------------
  cargarLogin(idUsuario: number): void {
    this.cargandoLogin = true;
    this.loginService.obtenerPorUsuario(idUsuario).subscribe({
      next: (login) => {
        this.login = login;
        this.cargandoLogin = false;
        console.log(login);
      },
      error: (err) => {
        this.login = null;
        this.cargandoLogin = false;
      },
    });
  }

  verDetalleLogin(): void {
    if (!this.login) return;
    this.router.navigate(['/detalles-login-admin', this.login.id_login]);
  }

  abrirCrearLogin(): void {
    // show inline form instead of navigating away
    this.erroresLogin = {};
    this.loginForm = {
      usuario: this.usuario?.id_usuario || this.id_usuario || undefined,
      username: '',
      password: '',
      rol: 'OPERADOR',
      is_active: true,
    };
    this.mostrarFormularioCrearLogin = true;
  }

  cerrarFormularioCrearLogin(): void {
    this.mostrarFormularioCrearLogin = false;
    this.creandoLogin = false;
    this.erroresLogin = {};
  }

  private validarLogin(): boolean {
    this.erroresLogin = {};
    const username = (this.loginForm.username || '').trim();
    const password = (this.loginForm.password || '').trim();
    const rol = this.loginForm.rol;

    if (!this.loginForm.usuario) {
      this.erroresLogin['usuario'] = 'Usuario inválido.';
    }
    if (!username) {
      this.erroresLogin['username'] = 'El nombre de usuario es obligatorio.';
    } else if (username.length < 3 || username.length > 150) {
      this.erroresLogin['username'] = 'El nombre de usuario debe tener entre 3 y 150 caracteres.';
    }

    if (!password) {
      this.erroresLogin['password'] = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      this.erroresLogin['password'] = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (!rol) {
      this.erroresLogin['rol'] = 'El rol es obligatorio.';
    }

    return Object.keys(this.erroresLogin).length === 0;
  }

  crearLogin(): void {
    if (!this.validarLogin()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    const payload: LoginCreate = {
      usuario: Number(this.loginForm.usuario),
      username: String((this.loginForm.username || '').trim()),
      password: String(this.loginForm.password),
      rol: (this.loginForm.rol as any) || 'OPERADOR',
      is_active: this.loginForm.is_active ?? true,
    };

    this.creandoLogin = true;
    this.loginService.crear(payload).subscribe({
      next: (login) => {
        this.creandoLogin = false;
        this.login = login;
        this.mostrarFormularioCrearLogin = false;
        this.message.showWarning('Login creado correctamente.');
      },
      error: (err) => {
        this.creandoLogin = false;
        console.error('Error crear login', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.erroresLogin[k] = Array.isArray(err.error[k])
              ? err.error[k][0]
              : String(err.error[k]);
          });
        } else {
          this.message.showWarning('No se pudo crear el login.');
        }
      },
    });
  }
}
