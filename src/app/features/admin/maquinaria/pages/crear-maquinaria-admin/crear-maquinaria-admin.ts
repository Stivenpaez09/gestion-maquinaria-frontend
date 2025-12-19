import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaquinariaCreate } from '../../../../../core/models/maquinaria.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { MessageService } from '../../../../../core/services/message.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-crear-maquinaria-admin',
  imports: [CommonModule, FormsModule, SidebarAdmin],
  templateUrl: './crear-maquinaria-admin.html',
  styleUrl: './crear-maquinaria-admin.scss',
})
export class CrearMaquinariaAdmin implements OnInit {
  // Formulario
  formulario: MaquinariaCreate = {
    nombre_maquina: '',
    modelo: '',
    marca: '',
    serie: '',
    fecha_adquisicion: '',
    horas_totales: 0,
    estado: 'operativa',
    foto: null,
  };

  // Foto
  fotoPreview: string | null = null;
  fotoFile: File | null = null;
  fotoNombre: string = '';

  // Estados
  estados = [
    { value: 'operativa', label: 'Operativa' },
    { value: 'en mantenimiento', label: 'En Mantenimiento' },
    { value: 'fuera de servicio', label: 'Fuera de Servicio' },
  ];

  // Control
  cargando: boolean = false;
  errores: { [key: string]: string } = {};

  constructor(
    private maquinariaService: MaquinariaService,
    private message: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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

  // Limpiar foto
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

    // Nombre maquinaria
    if (!this.formulario.nombre_maquina?.trim()) {
      this.errores['nombre_maquina'] = 'El nombre de la máquina es obligatorio.';
    } else if (
      this.formulario.nombre_maquina.length < 3 ||
      this.formulario.nombre_maquina.length > 100
    ) {
      this.errores['nombre_maquina'] = 'El nombre debe tener entre 3 y 100 caracteres.';
    }

    // Modelo
    if (!this.formulario.modelo?.trim()) {
      this.errores['modelo'] = 'El modelo es obligatorio.';
    } else if (this.formulario.modelo.length < 2 || this.formulario.modelo.length > 100) {
      this.errores['modelo'] = 'El modelo debe tener entre 2 y 100 caracteres.';
    }

    // Marca
    if (!this.formulario.marca?.trim()) {
      this.errores['marca'] = 'La marca es obligatoria.';
    } else if (this.formulario.marca.length < 2 || this.formulario.marca.length > 100) {
      this.errores['marca'] = 'La marca debe tener entre 2 y 100 caracteres.';
    }

    // Serie
    if (!this.formulario.serie?.trim()) {
      this.errores['serie'] = 'La serie es obligatoria.';
    } else if (this.formulario.serie.length < 3 || this.formulario.serie.length > 100) {
      this.errores['serie'] = 'La serie debe tener entre 3 y 100 caracteres.';
    }

    // Fecha de adquisición
    if (!this.formulario.fecha_adquisicion) {
      this.errores['fecha_adquisicion'] = 'La fecha de adquisición es obligatoria.';
    } else {
      const fecha = new Date(this.formulario.fecha_adquisicion);
      const hoy = new Date();
      if (fecha > hoy) {
        this.errores['fecha_adquisicion'] = 'La fecha de adquisición no puede ser futura.';
      }
    }

    // Horas totales
    if (this.formulario.horas_totales === null || this.formulario.horas_totales === undefined) {
      this.errores['horas_totales'] = 'El número de horas totales es obligatorio.';
    } else if (this.formulario.horas_totales < 0) {
      this.errores['horas_totales'] = 'Las horas totales deben ser un número positivo.';
    } else if (this.formulario.horas_totales > 99999999.99) {
      this.errores['horas_totales'] = 'El valor de horas es demasiado grande.';
    }

    // Estado
    if (!this.formulario.estado) {
      this.errores['estado'] = 'El estado de la máquina es obligatorio.';
    }

    // Validación cruzada: máquina operativa con 0 horas
    if (this.formulario.estado === 'operativa' && this.formulario.horas_totales === 0) {
      this.errores['horas_totales'] = 'Una máquina operativa debe tener más de 0 horas de uso.';
    }

    return Object.keys(this.errores).length === 0;
  }

  // -------------------------------------------------------
  // CREAR MAQUINARIA
  // -------------------------------------------------------
  crearMaquinaria(): void {
    if (!this.validarFormulario()) {
      this.message.showWarning('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.cargando = true;

    // Crear FormData
    const formData = new FormData();
    formData.append('nombre_maquina', this.formulario.nombre_maquina);
    formData.append('modelo', this.formulario.modelo || '');
    formData.append('marca', this.formulario.marca || '');
    formData.append('serie', this.formulario.serie || '');
    formData.append('fecha_adquisicion', this.formulario.fecha_adquisicion || '');
    formData.append('horas_totales', String(this.formulario.horas_totales || 0));
    formData.append('estado', this.formulario.estado);

    // Agregar foto si existe
    if (this.fotoFile) {
      formData.append('foto', this.fotoFile, this.fotoFile.name);
    }

    // Enviar al servicio
    this.maquinariaService.createMaquinariaFormData(formData).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.message.showWarning('Maquinaria creada exitosamente.');
        setTimeout(() => {
          this.router.navigate(['/ver-maquinarias-admin']);
        }, 1500);
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al crear maquinaria:', error);

        // Procesar errores del backend
        if (error.error && typeof error.error === 'object') {
          Object.keys(error.error).forEach((key) => {
            const mensaje = error.error[key];
            this.errores[key] = Array.isArray(mensaje) ? mensaje[0] : mensaje;
          });
        }

        const mensajeError = Object.values(this.errores).join(' ');
        this.message.showWarning(mensajeError || 'Error al crear la maquinaria. Intenta de nuevo.');
      },
    });
  }

  // -------------------------------------------------------
  // CANCELAR
  // -------------------------------------------------------
  cancelar(): void {
    this.router.navigate(['/ver-maquinarias-admin']);
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

  salir(): void {
    this.authService.logout();
  }
}
