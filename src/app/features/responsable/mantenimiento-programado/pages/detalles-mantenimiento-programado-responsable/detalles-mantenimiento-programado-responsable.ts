import { Component } from '@angular/core';
import { SidebarResponsable } from '../../../../../shared/components/sidebar-responsable/sidebar-responsable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import {
  MantenimientoProgramado,
  MantenimientoProgramadoCreate,
} from '../../../../../core/models/mantenimiento-programado.models';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { AuthService } from '../../../../../core/services/auth.service';
import { MantenimientoProgramadoService } from '../../../../../core/services/mantenimiento-programado.service';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { MessageService } from '../../../../../core/services/message.service';

@Component({
  selector: 'app-detalles-mantenimiento-programado-responsable',
  imports: [CommonModule, FormsModule, RouterModule, RouterLink, SidebarResponsable],
  templateUrl: './detalles-mantenimiento-programado-responsable.html',
  styleUrl: './detalles-mantenimiento-programado-responsable.scss',
})
export class DetallesMantenimientoProgramadoResponsable {
  cargando = false;
  id_programado: number | null = null;
  mantenimiento: MantenimientoProgramado | null = null;
  maquinaObj: Maquinaria | null = null;

  modoEdicion = false;
  mantenimientoForm: Partial<MantenimientoProgramadoCreate> = {};
  mantenimientoOriginal: Partial<MantenimientoProgramadoCreate> = {};
  errores: { [key: string]: string } = {};
  cargandoOperacion = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router,
    private mantenimientoService: MantenimientoProgramadoService,
    private maquinariaService: MaquinariaService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.id_programado = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id_programado) {
      this.cargarMantenimiento();
    }
  }

  salir(): void {
    this.authService.logout();
  }

  private cargarMantenimiento(): void {
    if (!this.id_programado) return;
    this.cargando = true;
    this.mantenimientoService.obtenerPorId(this.id_programado).subscribe({
      next: (m) => {
        this.mantenimiento = m;
        this.mantenimientoForm = {
          nombre: m.nombre,
          tipo: m.tipo,
          intervalo_horas: m.intervalo_horas,
          descripcion: m.descripcion ?? null,
          maquina: m.maquina,
        } as Partial<MantenimientoProgramadoCreate>;
        this.mantenimientoOriginal = JSON.parse(JSON.stringify(this.mantenimientoForm));
        this.maquinaObj = null;
        if (m.maquina !== undefined && m.maquina !== null) {
          this.maquinariaService.getMaquinariaById(m.maquina).subscribe({
            next: (mq) => (this.maquinaObj = mq),
            error: () => (this.maquinaObj = null),
          });
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargar mantenimiento', err);
        this.message.showWarning('No se pudo cargar el mantenimiento programado.');
        this.cargando = false;
      },
    });
  }

  activarEdicion(): void {
    if (!this.mantenimiento) return;
    this.modoEdicion = true;
    this.errores = {};
    this.mantenimientoOriginal = JSON.parse(JSON.stringify(this.mantenimientoForm));
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errores = {};
    this.mantenimientoForm = JSON.parse(JSON.stringify(this.mantenimientoOriginal));
  }

  // Comparar y retornar solo campos modificados
  private obtenerCambios(): Partial<MantenimientoProgramadoCreate> {
    const cambios: Partial<MantenimientoProgramadoCreate> = {};
    const campos: (keyof Partial<MantenimientoProgramadoCreate>)[] = [
      'nombre',
      'tipo',
      'intervalo_horas',
      'descripcion',
      // 'maquina' no editable en edición (queda fuera), pero si cambiaste la forma de permitirlo, se puede incluir
    ];

    campos.forEach((campo) => {
      const actual = this.mantenimientoForm[campo] ?? null;
      const original = this.mantenimientoOriginal[campo] ?? null;

      const valActual = actual === null || actual === undefined ? null : String(actual).trim();
      const valOriginal =
        original === null || original === undefined ? null : String(original).trim();

      if (valActual !== valOriginal) {
        if (campo === 'intervalo_horas') {
          cambios.intervalo_horas = Number(this.mantenimientoForm.intervalo_horas);
        } else if (campo === 'descripcion') {
          cambios.descripcion = this.mantenimientoForm.descripcion
            ? this.mantenimientoForm.descripcion.trim()
            : null;
        } else if (campo === 'nombre') {
          cambios.nombre = (this.mantenimientoForm.nombre || '').toString().trim();
        } else if (campo === 'tipo') {
          cambios.tipo = (this.mantenimientoForm.tipo || '').toString().trim() as
            | 'preventivo'
            | 'predictivo';
        }
      }
    });

    return cambios;
  }

  private validarParcial(): boolean {
    this.errores = {};
    const nombre = (this.mantenimientoForm.nombre ?? '').toString().trim();
    const tipo = (this.mantenimientoForm.tipo ?? '').toString().trim();
    const intervalo = this.mantenimientoForm.intervalo_horas;

    if (!nombre || nombre.length === 0) {
      this.errores['nombre'] = 'El nombre es obligatorio.';
    }

    if (!tipo || (tipo !== 'preventivo' && tipo !== 'predictivo')) {
      this.errores['tipo'] = 'El tipo debe ser preventivo o predictivo.';
    } else if (tipo.length < 3) {
      this.errores['tipo'] = 'Tipo inválido.';
    }

    if (intervalo === null || intervalo === undefined || Number.isNaN(Number(intervalo))) {
      this.errores['intervalo_horas'] = 'El intervalo en horas es obligatorio.';
    } else {
      const intVal = Number(intervalo);
      if (!Number.isInteger(intVal) || intVal <= 0) {
        this.errores['intervalo_horas'] = 'El intervalo debe ser un entero mayor que 0.';
      } else if (intVal > 100000) {
        this.errores['intervalo_horas'] = 'El intervalo no puede exceder 100,000 horas.';
      }
    }

    if (
      this.mantenimientoForm.descripcion &&
      this.mantenimientoForm.descripcion.trim().length === 0
    ) {
      this.errores['descripcion'] = 'La descripción no puede contener solo espacios.';
    }

    return Object.keys(this.errores).length === 0;
  }

  guardarCambios(): void {
    if (!this.id_programado) return;
    if (!this.validarParcial()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    const cambios = this.obtenerCambios();
    if (Object.keys(cambios).length === 0) {
      this.message.showWarning('No hay cambios para guardar.');
      return;
    }

    this.cargandoOperacion = true;
    this.mantenimientoService.actualizar(this.id_programado, cambios).subscribe({
      next: (res) => {
        this.cargandoOperacion = false;
        this.message.showWarning('Mantenimiento actualizado correctamente.');
        this.modoEdicion = false;
        this.cargarMantenimiento();
      },
      error: (err) => {
        this.cargandoOperacion = false;
        console.error('Error actualizar mantenimiento', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
        } else {
          this.message.showWarning('Error al actualizar el mantenimiento.');
        }
      },
    });
  }

  eliminarMantenimiento(): void {
    if (!this.id_programado || !this.mantenimiento) return;
    if (!confirm('¿Eliminar este mantenimiento programado? Esta acción no se puede deshacer.'))
      return;
    this.cargandoOperacion = true;
    this.mantenimientoService.eliminar(this.id_programado).subscribe({
      next: () => {
        this.cargandoOperacion = false;
        this.message.showWarning('Mantenimiento eliminado.');
        // regresar a la vista de la máquina
        const id_maquina = this.mantenimiento?.maquina;
        if (id_maquina) {
          this.router.navigate(['/detalles-maquinaria-responsable', id_maquina]);
        } else {
          this.router.navigate(['/ver-maquinarias-responsable']);
        }
      },
      error: (err) => {
        this.cargandoOperacion = false;
        console.error('Error eliminar mantenimiento', err);
        this.message.showWarning('No se pudo eliminar el mantenimiento.');
      },
    });
  }
}
