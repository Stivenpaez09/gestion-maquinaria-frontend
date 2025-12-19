import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Empresa } from '../../../../../core/models/empresa.models';
import { EmpresaService } from '../../../../../core/services/empresa.service';
import { MessageService } from '../../../../../core/services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-ver-empresas-admin',
  imports: [CommonModule, RouterLink, FormsModule, SidebarAdmin],
  templateUrl: './ver-empresas-admin.html',
  styleUrl: './ver-empresas-admin.scss',
})
export class VerEmpresasAdmin implements OnInit {
  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  searchTerm: string = '';
  cargando: boolean = true;

  constructor(
    private empresaService: EmpresaService,
    private authService: AuthService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.cargando = true;
    this.empresaService.listarEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
        this.empresasFiltradas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error listar empresas', err);
        this.message.showWarning('Error al cargar las empresas.');
        this.cargando = false;
      },
    });
  }

  buscar(): void {
    const termino = this.searchTerm?.trim().toLowerCase();
    if (!termino) {
      this.empresasFiltradas = this.empresas;
      return;
    }
    this.empresasFiltradas = this.empresas.filter((e) =>
      (e.nombre || '').toLowerCase().includes(termino)
    );
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.empresasFiltradas = this.empresas;
  }

  eliminarEmpresa(id: number, nombre: string): void {
    if (!confirm(`¿Eliminar la empresa "${nombre}"?`)) return;
    this.empresaService.eliminarEmpresa(id).subscribe({
      next: () => {
        this.message.showWarning('Empresa eliminada.');
        this.cargarEmpresas();
      },
      error: (err) => {
        console.error('Error eliminar empresa', err);
        this.message.showWarning('No se pudo eliminar la empresa.');
      },
    });
  }

  salir(): void {
    this.authService.logout();
  }
}
