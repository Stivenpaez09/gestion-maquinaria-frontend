import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MessageService } from '../../../../../core/services/message.service';
import { UsuarioCreate } from '../../../../../core/models/usuario.models';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-crear-usuario-admin',
  imports: [CommonModule, FormsModule, SidebarAdmin],
  templateUrl: './crear-usuario-admin.html',
  styleUrl: './crear-usuario-admin.scss',
})
export class CrearUsuarioAdmin implements OnInit {
  // Formulario
  formulario: UsuarioCreate = {
    nombre: '',
    cargo: '',
    email: null,
    telefono: null,
    fecha_ingreso: null,
    foto: null,
  };

  // Foto
  fotoPreview: string | null = null;
  fotoFile: File | null = null;
  fotoNombre: string = '';

  // Control
  cargando: boolean = false;
  errores: { [key: string]: string } = {};

  constructor(
    private usuarioService: UsuarioService,
    private message: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  salir(): void {
    this.authService.logout();
  }

  // -------------------------------------------------------
  // MANEJO DE FOTO
  // -------------------------------------------------------
  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];

      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
      if (!tiposPermitidos.includes(archivo.type)) {
        this.message.showWarning('Solo se permiten imágenes JPG, PNG o WebP');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (archivo.size > 5 * 1024 * 1024) {
        this.message.showWarning('El archivo no debe exceder 5MB');
        return;
      }

      this.fotoFile = archivo;
      this.fotoNombre = archivo.name;

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(archivo);
    }
  }

  limpiarFoto(): void {
    this.fotoFile = null;
    this.fotoPreview = null;
    this.fotoNombre = '';
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  }

  // -------------------------------------------------------
  // VALIDAR FORMULARIO
  // -------------------------------------------------------
  private validarFormulario(): boolean {
    this.errores = {};

    // Nombre
    const nombre = (this.formulario.nombre || '').trim();
    if (!nombre) {
      this.errores['nombre'] = 'El nombre es obligatorio.';
    } else if (nombre.length < 3 || nombre.length > 100) {
      this.errores['nombre'] = 'El nombre debe tener entre 3 y 100 caracteres.';
    }

    // Cargo
    const cargo = (this.formulario.cargo || '').trim();
    if (!cargo) {
      this.errores['cargo'] = 'El cargo es obligatorio.';
    } else if (cargo.length > 100) {
      this.errores['cargo'] = 'El cargo debe tener máximo 100 caracteres.';
    }

    // Email
    const email = (this.formulario.email || '').trim();
    if (!email) {
      this.errores['email'] = 'El correo electrónico es obligatorio.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.errores['email'] = 'Correo electrónico inválido.';
      }
    }

    // Teléfono
    const telefono = (this.formulario.telefono || '').trim();
    if (!telefono) {
      this.errores['telefono'] = 'El número de teléfono es obligatorio.';
    } else {
      const telefonoRegex = /^\d{7,15}$/;
      if (!telefonoRegex.test(telefono)) {
        this.errores['telefono'] = 'El teléfono debe contener entre 7 y 15 dígitos numéricos.';
      }
    }

    // Fecha de ingreso
    if (!this.formulario.fecha_ingreso) {
      this.errores['fecha_ingreso'] = 'La fecha de ingreso es obligatoria.';
    } else {
      const fecha = new Date(this.formulario.fecha_ingreso);
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (fecha > hoy) {
        this.errores['fecha_ingreso'] = 'La fecha de ingreso no puede ser futura.';
      }
    }

    return Object.keys(this.errores).length === 0;
  }

  // -------------------------------------------------------
  // CREAR USUARIO
  // -------------------------------------------------------
  crearUsuario(): void {
    if (!this.validarFormulario()) {
      this.message.showWarning('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.cargando = true;

    // Preparar datos para FormData
    const data: any = {
      nombre: this.formulario.nombre?.trim(),
      cargo: this.formulario.cargo?.trim(),
      email: this.formulario.email?.trim(),
      telefono: this.formulario.telefono?.trim(),
      fecha_ingreso: this.formulario.fecha_ingreso,
    };

    // Agregar foto si existe
    if (this.fotoFile) {
      data.foto = this.fotoFile;
    }

    // Enviar al servicio
    this.usuarioService.createUsuario(data).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.message.showWarning('Usuario creado exitosamente.');
        setTimeout(() => {
          this.router.navigate(['/ver-usuarios-admin']);
        }, 1500);
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al crear usuario:', error);

        // Procesar errores del backend
        if (error.error && typeof error.error === 'object') {
          Object.keys(error.error).forEach((key) => {
            const mensaje = error.error[key];
            this.errores[key] = Array.isArray(mensaje) ? mensaje[0] : String(mensaje);
          });
        }

        const mensajeError = Object.values(this.errores).join('. ');
        this.message.showWarning(mensajeError || 'Error al crear el usuario. Intenta de nuevo.');
      },
    });
  }

  // -------------------------------------------------------
  // CANCELAR
  // -------------------------------------------------------
  cancelar(): void {
    this.router.navigate(['/ver-usuarios-admin']);
  }

  // -------------------------------------------------------
  // VERIFICAR ERRORES
  // -------------------------------------------------------
  tieneError(campo: string): boolean {
    return !!this.errores[campo];
  }

  obtenerError(campo: string): string {
    return this.errores[campo] || '';
  }
}
