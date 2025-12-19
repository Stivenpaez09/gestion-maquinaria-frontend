import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { EmpresaService } from '../../../../../core/services/empresa.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Empresa, EmpresaUpdate } from '../../../../../core/models/empresa.models';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-detalles-empresa-admin',
  imports: [CommonModule, FormsModule, RouterLink, SidebarAdmin],
  templateUrl: './detalles-empresa-admin.html',
  styleUrl: './detalles-empresa-admin.scss',
})
export class DetallesEmpresaAdmin implements OnInit {
  empresa: Empresa | null = null;
  id_empresa: number | null = null;
  cargando: boolean = true;

  modoEdicion: boolean = false;
  empresaForm: EmpresaUpdate = {};
  empresaOriginal: EmpresaUpdate = {}; // Guardar valores originales
  errores: { [key: string]: string } = {};
  cargandoOperacion: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private empresaService: EmpresaService,
    private router: Router,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.id_empresa = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id_empresa) {
      this.cargarEmpresa();
    }
  }

  salir(): void {
    this.authService.logout();
  }

  cargarEmpresa(): void {
    if (!this.id_empresa) return;
    this.cargando = true;
    this.empresaService.obtenerEmpresa(this.id_empresa).subscribe({
      next: (e) => {
        this.empresa = e;
        this.empresaForm = {
          nombre: e.nombre,
          nit: e.nit,
          direccion: e.direccion ?? '',
          ciudad: e.ciudad ?? '',
          departamento: e.departamento ?? '',
          telefono: e.telefono ?? '',
          email: e.email ?? '',
          representante_legal: e.representante_legal ?? '',
          sector: e.sector ?? '',
        };
        // Guardar copia original para comparar cambios
        this.empresaOriginal = JSON.parse(JSON.stringify(this.empresaForm));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargar empresa', err);
        this.message.showWarning('Error al cargar la empresa.');
        this.cargando = false;
      },
    });
  }

  activarEdicion(): void {
    if (!this.empresa) return;
    this.modoEdicion = true;
    this.empresaOriginal = JSON.parse(JSON.stringify(this.empresaForm));
    this.errores = {};
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errores = {};
    // Restaurar valores originales
    this.empresaForm = JSON.parse(JSON.stringify(this.empresaOriginal));
  }

  // Detectar campos modificados
  private obtenerCambios(): EmpresaUpdate {
    const cambios: EmpresaUpdate = {};

    const campos: (keyof EmpresaUpdate)[] = [
      'nombre',
      'nit',
      'direccion',
      'ciudad',
      'departamento',
      'telefono',
      'email',
      'representante_legal',
      'sector',
    ];

    campos.forEach((campo) => {
      const valorActual = (this.empresaForm[campo] ?? '').toString().trim();
      const valorOriginal = (this.empresaOriginal[campo] ?? '').toString().trim();

      if (valorActual !== valorOriginal) {
        cambios[campo] = valorActual;
      }
    });

    return cambios;
  }

  private validarParcial(): boolean {
    this.errores = {};
    const nombre = (this.empresaForm.nombre ?? '').trim();
    const nit = (this.empresaForm.nit ?? '').trim();
    const direccion = (this.empresaForm.direccion ?? '').trim();
    const ciudad = (this.empresaForm.ciudad ?? '').trim();
    const departamento = (this.empresaForm.departamento ?? '').trim();
    const telefono = (this.empresaForm.telefono ?? '').trim();
    const email = (this.empresaForm.email ?? '').trim();
    const representante = (this.empresaForm.representante_legal ?? '').trim();
    const sector = (this.empresaForm.sector ?? '').trim();

    if (!nombre || nombre.length < 3 || nombre.length > 150) {
      this.errores['nombre'] = 'El nombre debe tener entre 3 y 150 caracteres.';
    }
    if (!nit || !/^\d{5,20}$/.test(nit)) {
      this.errores['nit'] = 'El NIT debe contener sólo dígitos (5-20).';
    }
    if (!direccion || direccion.length < 5 || direccion.length > 200) {
      this.errores['direccion'] = 'La dirección debe tener entre 5 y 200 caracteres.';
    }
    if (!ciudad) this.errores['ciudad'] = 'La ciudad es obligatoria.';
    if (!departamento) this.errores['departamento'] = 'El departamento es obligatorio.';
    if (!telefono || !/^\d{7,15}$/.test(telefono)) {
      this.errores['telefono'] = 'El teléfono debe contener sólo dígitos (7-15).';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errores['email'] = 'Correo electrónico inválido.';
    }
    if (!representante || representante.length < 3 || representante.length > 150) {
      this.errores['representante_legal'] = 'El representante debe tener entre 3 y 150 caracteres.';
    }
    if (!sector) this.errores['sector'] = 'El sector económico es obligatorio.';

    return Object.keys(this.errores).length === 0;
  }

  guardarCambios(): void {
    if (!this.id_empresa) return;
    if (!this.validarParcial()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    // Obtener SOLO los campos modificados
    const cambios = this.obtenerCambios();

    // Si no hay cambios, no enviar nada
    if (Object.keys(cambios).length === 0) {
      this.message.showWarning('No hay cambios para guardar.');
      return;
    }

    this.cargandoOperacion = true;
    this.empresaService.actualizarEmpresa(this.id_empresa, cambios).subscribe({
      next: (updated) => {
        this.cargandoOperacion = false;
        this.message.showWarning('Empresa actualizada correctamente.');
        this.modoEdicion = false;
        this.cargarEmpresa();
      },
      error: (err) => {
        this.cargandoOperacion = false;
        console.error('Error actualizar empresa', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
        } else {
          this.message.showWarning('Error al actualizar la empresa.');
        }
      },
    });
  }

  eliminarEmpresa(): void {
    if (!this.id_empresa) return;
    if (!confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.'))
      return;
    this.cargandoOperacion = true;
    this.empresaService.eliminarEmpresa(this.id_empresa).subscribe({
      next: () => {
        this.cargandoOperacion = false;
        this.message.showWarning('Empresa eliminada.');
        this.router.navigate(['/ver-empresas-admin']);
      },
      error: (err) => {
        this.cargandoOperacion = false;
        console.error('Error eliminar empresa', err);
        this.message.showWarning('No se pudo eliminar la empresa.');
      },
    });
  }
}
