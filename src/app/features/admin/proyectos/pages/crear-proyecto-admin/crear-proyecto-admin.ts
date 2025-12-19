import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmpresaService } from '../../../../../core/services/empresa.service';
import { ProyectoService } from '../../../../../core/services/proyecto.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Empresa } from '../../../../../core/models/empresa.models';
import { ProyectoUpdate } from '../../../../../core/models/proyecto.models';
import { AuthService } from '../../../../../core/services/auth.service';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-crear-proyecto-admin',
  imports: [CommonModule, FormsModule, RouterLink, SidebarAdmin],
  templateUrl: './crear-proyecto-admin.html',
  styleUrl: './crear-proyecto-admin.scss',
})
export class CrearProyectoAdmin implements OnInit {
  empresas: Empresa[] = [];
  cargandoEmpresas: boolean = false;

  proyectoForm: ProyectoUpdate = {
    nombre_proyecto: '',
    empresa: null,
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
  };

  errores: { [key: string]: string } = {};
  cargando: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    private proyectoService: ProyectoService,
    private authService: AuthService,
    private message: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  salir(): void {
    this.authService.logout();
  }

  cargarEmpresas(): void {
    this.cargandoEmpresas = true;
    this.empresaService.listarEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
        this.cargandoEmpresas = false;
      },
      error: (err) => {
        console.error('Error cargando empresas', err);
        this.message.showWarning('No se pudieron cargar las empresas.');
        this.cargandoEmpresas = false;
      },
    });
  }

  private validar(): boolean {
    this.errores = {};
    const nombre = (this.proyectoForm.nombre_proyecto ?? '').trim();
    const descripcion = (this.proyectoForm.descripcion ?? '').trim();
    const inicio = this.proyectoForm.fecha_inicio || '';
    const fin = this.proyectoForm.fecha_fin || '';

    if (!nombre || nombre.length < 3 || nombre.length > 150) {
      this.errores['nombre_proyecto'] = 'El nombre debe tener entre 3 y 150 caracteres.';
    }

    if (descripcion.length > 5000) {
      this.errores['descripcion'] = 'La descripción no puede exceder 5000 caracteres.';
    }

    if (inicio && isNaN(Date.parse(inicio))) {
      this.errores['fecha_inicio'] = 'Fecha de inicio inválida.';
    }
    if (fin && isNaN(Date.parse(fin))) {
      this.errores['fecha_fin'] = 'Fecha de fin inválida.';
    }

    if (inicio && fin) {
      const dInicio = new Date(inicio);
      const dFin = new Date(fin);
      if (dFin < dInicio) {
        this.errores['fecha_fin'] = 'La fecha de fin no puede ser menor a la fecha de inicio.';
      }
    }

    if (inicio) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const dInicio = new Date(inicio);
      if (dInicio > hoy) {
        this.errores['fecha_inicio'] = 'La fecha de inicio no puede ser en el futuro.';
      }
    }

    return Object.keys(this.errores).length === 0;
  }

  crearProyecto(): void {
    if (!this.validar()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    const payload: ProyectoUpdate = {
      nombre_proyecto: (this.proyectoForm.nombre_proyecto || '').trim(),
      empresa: this.proyectoForm.empresa ?? null,
      descripcion: this.proyectoForm.descripcion?.trim() || null,
      fecha_inicio: this.proyectoForm.fecha_inicio || null,
      fecha_fin: this.proyectoForm.fecha_fin || null,
    };

    this.cargando = true;
    this.proyectoService.createProyecto(payload).subscribe({
      next: (res) => {
        this.cargando = false;
        this.message.showWarning('Proyecto creado correctamente.');
        this.router.navigate(['/ver-proyectos-admin']);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error crear proyecto', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
        } else {
          this.message.showWarning('Error al crear el proyecto.');
        }
      },
    });
  }
}
