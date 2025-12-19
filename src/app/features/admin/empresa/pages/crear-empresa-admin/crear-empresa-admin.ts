import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../../../core/services/empresa.service';
import { MessageService } from '../../../../../core/services/message.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { EmpresaUpdate } from '../../../../../core/models/empresa.models';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-crear-empresa-admin',
  imports: [CommonModule, RouterLink, FormsModule, SidebarAdmin],
  templateUrl: './crear-empresa-admin.html',
  styleUrl: './crear-empresa-admin.scss',
})
export class CrearEmpresaAdmin {
  empresaForm: EmpresaUpdate = {
    nombre: '',
    nit: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    telefono: '',
    email: '',
    representante_legal: '',
    sector: '',
  };

  errores: { [key: string]: string } = {};
  cargando: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    private message: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  salir(): void {
    this.authService.logout();
  }

  private validarFormulario(): boolean {
    this.errores = {};
    const nombre = (this.empresaForm.nombre || '').trim();
    const nit = (this.empresaForm.nit || '').trim();
    const direccion = (this.empresaForm.direccion || '').trim();
    const ciudad = (this.empresaForm.ciudad || '').trim();
    const departamento = (this.empresaForm.departamento || '').trim();
    const telefono = (this.empresaForm.telefono || '').trim();
    const email = (this.empresaForm.email || '').trim();
    const representante = (this.empresaForm.representante_legal || '').trim();
    const sector = (this.empresaForm.sector || '').trim();

    if (!nombre || nombre.length < 3 || nombre.length > 150) {
      this.errores['nombre'] = 'El nombre debe tener entre 3 y 150 caracteres.';
    }

    if (!nit || !/^\d{5,20}$/.test(nit)) {
      this.errores['nit'] = 'El NIT debe contener sólo dígitos (5-20).';
    }

    if (!direccion || direccion.length < 5 || direccion.length > 200) {
      this.errores['direccion'] = 'La dirección debe tener entre 5 y 200 caracteres.';
    }

    if (!ciudad) {
      this.errores['ciudad'] = 'La ciudad es obligatoria.';
    }

    if (!departamento) {
      this.errores['departamento'] = 'El departamento es obligatorio.';
    }

    if (!telefono || !/^\d{7,15}$/.test(telefono)) {
      this.errores['telefono'] = 'El teléfono debe contener sólo dígitos (7-15).';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errores['email'] = 'Correo electrónico inválido.';
    }

    if (!representante || representante.length < 3 || representante.length > 150) {
      this.errores['representante_legal'] = 'El representante debe tener entre 3 y 150 caracteres.';
    }

    if (!sector) {
      this.errores['sector'] = 'El sector económico es obligatorio.';
    }

    return Object.keys(this.errores).length === 0;
  }

  crearEmpresa(): void {
    if (!this.validarFormulario()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    this.cargando = true;
    // enviar sólo los campos necesarios (EmpresaUpdate)
    const payload: EmpresaUpdate = {
      nombre: this.empresaForm.nombre?.trim(),
      nit: this.empresaForm.nit?.trim(),
      direccion: this.empresaForm.direccion?.trim(),
      ciudad: this.empresaForm.ciudad?.trim(),
      departamento: this.empresaForm.departamento?.trim(),
      telefono: this.empresaForm.telefono?.trim(),
      email: this.empresaForm.email?.trim(),
      representante_legal: this.empresaForm.representante_legal?.trim(),
      sector: this.empresaForm.sector?.trim(),
    };

    this.empresaService.crearEmpresa(payload).subscribe({
      next: (empresa) => {
        this.cargando = false;
        this.message.showWarning('Empresa creada exitosamente.');
        // redirigir a la lista de empresas
        this.router.navigate(['/ver-empresas-admin']);
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error crear empresa:', error);
        // Mapear errores del backend (serializer) al objeto errores
        if (error.error && typeof error.error === 'object') {
          Object.keys(error.error).forEach((key) => {
            const val = error.error[key];
            this.errores[key] = Array.isArray(val) ? val[0] : String(val);
          });
        } else {
          this.message.showWarning('Error al crear la empresa.');
        }
      },
    });
  }
}
