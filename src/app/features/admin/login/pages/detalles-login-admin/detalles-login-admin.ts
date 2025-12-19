import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { LoginService } from '../../../../../core/services/login.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Login } from '../../../../../core/models/login.models';
import { Usuario } from '../../../../../core/models/usuario.models';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-detalles-login-admin',
  imports: [RouterModule, CommonModule, FormsModule, SidebarAdmin],
  templateUrl: './detalles-login-admin.html',
  styleUrl: './detalles-login-admin.scss',
})
export class DetallesLoginAdmin implements OnInit {
  login?: Partial<
    Login & {
      rol?: string;
      usuario?: number;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    }
  >;
  usuario?: Usuario | null;
  cargando = false;
  modoEdicion = false;
  guardando = false;
  errores: Record<string, string> = {};
  form: Partial<{ username: string; rol: string; is_active: boolean; password?: string }> = {
    username: '',
    rol: 'OPERADOR',
    is_active: true,
    password: '',
  };
  showPassword = false;
  private idLogin: number | null = null;

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private message: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/ver-logins-admin']);
      return;
    }
    this.idLogin = Number(id);
    this.cargarLogin();
  }

  salir(): void {
    this.authService.logout();
  }

  private cargarLogin(): void {
    if (!this.idLogin) return;
    this.cargando = true;
    this.loginService.obtener(this.idLogin).subscribe({
      next: (l: any) => {
        this.login = l;
        this.cargando = false;
        if (l?.usuario) this.cargarUsuario(Number(l.usuario));
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.message.showWarning?.('No se pudo cargar el login.');
        this.router.navigate(['/ver-logins-admin']);
      },
    });
  }

  private cargarUsuario(idUsuario: number): void {
    this.usuario = undefined;
    this.usuarioService.getUsuarioById(idUsuario).subscribe({
      next: (u) => (this.usuario = u),
      error: () => (this.usuario = null),
    });
  }

  activarEdicion(): void {
    if (!this.login) return;
    this.errores = {};
    this.modoEdicion = true;
    this.form = {
      username: String(this.login.username || ''),
      rol: String(this.login.rol || 'OPERADOR'),
      is_active: !!this.login.is_active,
      password: '', // no precargar contraseña
    };
    this.showPassword = false;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errores = {};
    if (this.login) {
      this.form = {
        username: String(this.login.username || ''),
        rol: String(this.login.rol || 'OPERADOR'),
        is_active: !!this.login.is_active,
        password: '',
      };
    }
    this.showPassword = false;
  }

  private validarLocal(): boolean {
    this.errores = {};
    const u = (this.form.username || '').trim();
    if (!u) this.errores['username'] = 'El nombre de usuario es obligatorio.';
    else if (u.length < 3)
      this.errores['username'] = 'El nombre de usuario debe tener al menos 3 caracteres.';

    if (!this.form.rol) this.errores['rol'] = 'El rol es obligatorio.';

    const pw = (this.form.password || '').trim();
    if (pw && pw.length < 6)
      this.errores['password'] = 'La contraseña debe tener al menos 6 caracteres.';

    return Object.keys(this.errores).length === 0;
  }

  guardarCambios(): void {
    if (!this.login || !this.idLogin) return;
    if (!this.validarLocal()) {
      this.message.showWarning?.('Corrige los errores del formulario.');
      return;
    }

    const payload: any = {};
    if ((this.form.username || '').trim() !== (this.login.username || ''))
      payload.username = (this.form.username || '').trim();
    if ((this.form.rol || '') !== (this.login.rol || '')) payload.rol = this.form.rol;
    if ((this.form.is_active ?? false) !== !!this.login.is_active)
      payload.is_active = !!this.form.is_active;

    const pw = (this.form.password || '').trim();
    if (pw) payload.password = pw; // incluir solo si se suministra nueva contraseña

    if (Object.keys(payload).length === 0) {
      this.modoEdicion = false;
      return;
    }

    this.guardando = true;
    this.loginService.actualizar(this.idLogin, payload).subscribe({
      next: (updated: any) => {
        this.login = { ...this.login, ...updated };
        this.guardando = false;
        this.modoEdicion = false;
        this.errores = {};
        this.message.showWarning('Login actualizado correctamente.');
      },
      error: (err) => {
        this.guardando = false;
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
        }
        this.message.showWarning?.('No se pudo actualizar el login.');
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  eliminarLogin(): void {
    if (!this.idLogin) return;
    if (!confirm('¿Eliminar este login? Esta acción no se puede deshacer.')) return;
    this.loginService.eliminar(this.idLogin).subscribe({
      next: () => {
        this.message.showWarning('Login eliminado.');
        this.router.navigate(['/ver-logins-admin']);
      },
      error: () => {
        this.message.showWarning?.('No se pudo eliminar el login.');
      },
    });
  }

  verDetalleUsuario(): void {
    const id = this.login?.usuario ?? null;
    if (!id) return;
    this.router.navigate(['/detalles-usuario-admin', id]);
  }

  volver(): void {
    const id = this.login?.usuario ?? null;
    if (!id) return;
    this.router.navigate(['/detalles-usuario-admin', id]);
  }
}
