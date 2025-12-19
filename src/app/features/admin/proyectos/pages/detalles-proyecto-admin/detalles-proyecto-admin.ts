import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { ProyectoService } from '../../../../../core/services/proyecto.service';
import { EmpresaService } from '../../../../../core/services/empresa.service';
import { MessageService } from '../../../../../core/services/message.service';
import { ProyectoMaquinariaService } from '../../../../../core/services/proyecto-maquinaria.service';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { Proyecto, ProyectoUpdate } from '../../../../../core/models/proyecto.models';
import { Empresa } from '../../../../../core/models/empresa.models';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import {
  ProyectoMaquinaria,
  ProyectoMaquinariaCreate,
} from '../../../../../core/models/proyecto-maquinaria.models';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-detalles-proyecto-admin',
  imports: [CommonModule, FormsModule, RouterLink, SidebarAdmin],
  templateUrl: './detalles-proyecto-admin.html',
  styleUrl: './detalles-proyecto-admin.scss',
})
export class DetallesProyectoAdmin implements OnInit {
  proyecto: Proyecto | null = null;
  empresaObj: Empresa | null = null;
  empresas: Empresa[] = [];
  id_proyecto: number | null = null;
  cargando: boolean = true;
  cargandoEmpresas: boolean = false;

  modoEdicion: boolean = false;
  proyectoForm: ProyectoUpdate = {};
  proyectoOriginal: ProyectoUpdate = {};
  errores: { [key: string]: string } = {};
  cargandoOperacion: boolean = false;

  // Formulario agregar maquinaria
  mostrarFormularioMaquinaria: boolean = false;
  maquinarias: Maquinaria[] = [];
  cargandoMaquinarias: boolean = false;
  proyectoMaquinariaForm: ProyectoMaquinariaCreate = {
    proyecto: 0,
    maquina: 0,
    horas_totales: 0,
    finalizado: false,
  };
  erroresMaquinaria: { [key: string]: string } = {};
  cargandoCrearMaquinaria: boolean = false;

  // Lista de maquinarias asignadas
  proyectoMaquinarias: ProyectoMaquinaria[] = [];
  cargandoProyectoMaquinarias: boolean = false;
  editandoHoras: { [id: number]: boolean } = {};
  horasTemporales: { [id: number]: number } = {};
  cargandoEliminar: { [id: number]: boolean } = {};
  cargandoEditar: { [id: number]: boolean } = {};

  constructor(
    private authservice: AuthService,
    private route: ActivatedRoute,
    private proyectoService: ProyectoService,
    private empresaService: EmpresaService,
    private proyectoMaquinariaService: ProyectoMaquinariaService,
    private maquinariaService: MaquinariaService,
    private router: Router,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.id_proyecto = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id_proyecto) {
      this.cargarProyecto();
      this.cargarMaquinarias();
      this.cargarProyectoMaquinarias();
    }
  }

  salir(): void {
    this.authservice.logout();
  }

  cargarProyecto(): void {
    if (!this.id_proyecto) return;
    this.cargando = true;
    this.proyectoService.getProyectoById(this.id_proyecto).subscribe({
      next: (p) => {
        this.proyecto = p;
        this.proyectoForm = {
          nombre_proyecto: p.nombre_proyecto,
          empresa: p.empresa ?? null,
          descripcion: p.descripcion ?? null,
          fecha_inicio: p.fecha_inicio ?? null,
          fecha_fin: p.fecha_fin ?? null,
        };
        this.proyectoOriginal = JSON.parse(JSON.stringify(this.proyectoForm));
        this.empresaObj = null;
        if (p.empresa !== null && p.empresa !== undefined) {
          this.empresaService.obtenerEmpresa(p.empresa).subscribe({
            next: (e) => (this.empresaObj = e),
            error: () => (this.empresaObj = null),
          });
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargar proyecto', err);
        this.message.showWarning('No se pudo cargar el proyecto.');
        this.cargando = false;
      },
    });
  }

  cargarMaquinarias(): void {
    this.cargandoMaquinarias = true;
    this.maquinariaService.getMaquinarias().subscribe({
      next: (data) => {
        this.maquinarias = data;
        this.cargandoMaquinarias = false;
      },
      error: (err) => {
        console.error('Error cargando maquinarias', err);
        this.message.showWarning('No se pudieron cargar las maquinarias.');
        this.cargandoMaquinarias = false;
      },
    });
  }

  cargarProyectoMaquinarias(): void {
    if (!this.id_proyecto) return;
    this.cargandoProyectoMaquinarias = true;
    this.proyectoMaquinariaService.listarPorProyecto(this.id_proyecto).subscribe({
      next: (data) => {
        this.proyectoMaquinarias = data;
        this.cargandoProyectoMaquinarias = false;
      },
      error: (err) => {
        console.error('Error cargando proyecto maquinarias', err);
        this.message.showWarning('No se pudieron cargar las maquinarias asignadas.');
        this.cargandoProyectoMaquinarias = false;
      },
    });
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

  activarEdicion(): void {
    if (!this.proyecto) return;
    this.modoEdicion = true;
    this.proyectoOriginal = JSON.parse(JSON.stringify(this.proyectoForm));
    this.errores = {};
    this.cargarEmpresas();
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errores = {};
    this.proyectoForm = JSON.parse(JSON.stringify(this.proyectoOriginal));
  }

  irADetallesEmpresa(idEmpresa: number): void {
    this.router.navigate(['/detalles-empresa-admin', idEmpresa]);
  }

  // -------------------------------------------------------
  // FORMULARIO AGREGAR MAQUINARIA
  // -------------------------------------------------------
  mostrarFormularioAgregarMaquinaria(): void {
    if (!this.id_proyecto) return;
    this.mostrarFormularioMaquinaria = true;
    this.proyectoMaquinariaForm = {
      proyecto: this.id_proyecto,
      maquina: 0,
      horas_totales: 0,
      finalizado: false,
    };
    this.erroresMaquinaria = {};
  }

  cancelarAgregarMaquinaria(): void {
    this.mostrarFormularioMaquinaria = false;
    this.proyectoMaquinariaForm = {
      proyecto: 0,
      maquina: 0,
      horas_totales: 0,
      finalizado: false,
    };
    this.erroresMaquinaria = {};
  }

  private validarFormularioMaquinaria(): boolean {
    this.erroresMaquinaria = {};

    // Validar proyecto
    if (!this.proyectoMaquinariaForm.proyecto || this.proyectoMaquinariaForm.proyecto <= 0) {
      this.erroresMaquinaria['proyecto'] = 'Debe especificar el proyecto asociado.';
    }

    // Validar máquina
    if (!this.proyectoMaquinariaForm.maquina || this.proyectoMaquinariaForm.maquina <= 0) {
      this.erroresMaquinaria['maquina'] = 'Debe especificar la máquina asociada.';
    } else {
      // Validar que la máquina esté operativa
      const maquinaSeleccionada = this.maquinarias.find(
        (m) => m.id_maquina === this.proyectoMaquinariaForm.maquina
      );
      if (maquinaSeleccionada && maquinaSeleccionada.estado !== 'operativa') {
        this.erroresMaquinaria[
          'maquina'
        ] = `La máquina '${maquinaSeleccionada.nombre_maquina}' no está operativa (estado actual: ${maquinaSeleccionada.estado}).`;
      }
    }

    // Validar horas totales
    const horasTotales = Number(this.proyectoMaquinariaForm.horas_totales);
    if (isNaN(horasTotales) || horasTotales < 0) {
      this.erroresMaquinaria['horas_totales'] = 'Las horas totales no pueden ser negativas.';
    } else if (horasTotales === 0) {
      this.erroresMaquinaria['horas_totales'] = 'Debe indicar las horas totales pactadas.';
    }

    // Validar proyecto finalizado
    if (this.proyecto && this.proyecto.fecha_fin) {
      const fechaFin = new Date(this.proyecto.fecha_fin);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaFin < hoy) {
        this.erroresMaquinaria['proyecto'] =
          'No se puede asignar máquinas a un proyecto que ya ha finalizado.';
      }
    }

    return Object.keys(this.erroresMaquinaria).length === 0;
  }

  crearProyectoMaquinaria(): void {
    if (!this.validarFormularioMaquinaria()) {
      this.message.showWarning('Corrige los errores del formulario.');
      return;
    }

    this.cargandoCrearMaquinaria = true;
    this.proyectoMaquinariaService.crear(this.proyectoMaquinariaForm).subscribe({
      next: () => {
        this.cargandoCrearMaquinaria = false;
        this.message.showWarning('Máquina asignada al proyecto correctamente.');
        this.cancelarAgregarMaquinaria();
        this.cargarProyectoMaquinarias();
      },
      error: (err) => {
        this.cargandoCrearMaquinaria = false;
        console.error('Error crear proyecto maquinaria', err);
        if (err.error && typeof err.error === 'object') {
          const erroresBackend: string[] = [];
          Object.keys(err.error).forEach((k) => {
            const mensaje = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
            this.erroresMaquinaria[k] = mensaje;
            erroresBackend.push(mensaje);
          });
          if (erroresBackend.length > 0) {
            this.message.showWarning(erroresBackend.join('. '));
          }
        } else {
          this.message.showWarning('Error al asignar la máquina al proyecto.');
        }
      },
    });
  }

  // -------------------------------------------------------
  // GESTIÓN DE MAQUINARIAS ASIGNADAS
  // -------------------------------------------------------
  obtenerNombreMaquina(idMaquina: number): string {
    const maquina = this.maquinarias.find((m) => m.id_maquina === idMaquina);
    return maquina ? maquina.nombre_maquina : `Máquina #${idMaquina}`;
  }

  activarEdicionHoras(id: number, horasActuales: number): void {
    this.editandoHoras[id] = true;
    this.horasTemporales[id] = horasActuales;
  }

  cancelarEdicionHoras(id: number): void {
    this.editandoHoras[id] = false;
    delete this.horasTemporales[id];
  }

  guardarHorasTotales(pm: ProyectoMaquinaria): void {
    const horasNuevas = this.horasTemporales[pm.id_proyecto_maquinaria];

    if (horasNuevas === undefined || horasNuevas === null) {
      this.message.showWarning('Debe ingresar un valor válido para las horas totales.');
      return;
    }

    const horasNum = Number(horasNuevas);
    if (isNaN(horasNum) || horasNum < 0) {
      this.message.showWarning('Las horas totales no pueden ser negativas.');
      return;
    }

    if (horasNum === pm.horas_totales) {
      this.cancelarEdicionHoras(pm.id_proyecto_maquinaria);
      return;
    }

    // Validar que horas_acumuladas no supere horas_totales
    if (pm.horas_acumuladas > horasNum) {
      this.message.showWarning(
        'Las horas acumuladas no pueden superar las horas totales pactadas.'
      );
      return;
    }

    this.cargandoEditar[pm.id_proyecto_maquinaria] = true;
    this.proyectoMaquinariaService
      .actualizar(pm.id_proyecto_maquinaria, { horas_totales: horasNum })
      .subscribe({
        next: () => {
          this.cargandoEditar[pm.id_proyecto_maquinaria] = false;
          this.message.showWarning('Horas totales actualizadas correctamente.');
          this.cancelarEdicionHoras(pm.id_proyecto_maquinaria);
          this.cargarProyectoMaquinarias();
        },
        error: (err) => {
          this.cargandoEditar[pm.id_proyecto_maquinaria] = false;
          console.error('Error actualizar horas totales', err);
          if (err.error && typeof err.error === 'object') {
            const erroresBackend: string[] = [];
            Object.keys(err.error).forEach((k) => {
              const mensaje = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
              erroresBackend.push(mensaje);
            });
            if (erroresBackend.length > 0) {
              this.message.showWarning(erroresBackend.join('. '));
            }
          } else {
            this.message.showWarning('Error al actualizar las horas totales.');
          }
        },
      });
  }

  eliminarProyectoMaquinaria(pm: ProyectoMaquinaria): void {
    const nombreMaquina = this.obtenerNombreMaquina(pm.maquina);
    if (
      !confirm(
        `¿Estás seguro de eliminar la asignación de la máquina "${nombreMaquina}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    this.cargandoEliminar[pm.id_proyecto_maquinaria] = true;
    this.proyectoMaquinariaService.eliminar(pm.id_proyecto_maquinaria).subscribe({
      next: () => {
        this.cargandoEliminar[pm.id_proyecto_maquinaria] = false;
        this.message.showWarning('Asignación eliminada correctamente.');
        this.cargarProyectoMaquinarias();
      },
      error: (err) => {
        this.cargandoEliminar[pm.id_proyecto_maquinaria] = false;
        console.error('Error eliminar proyecto maquinaria', err);
        this.message.showWarning('Error al eliminar la asignación.');
      },
    });
  }

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
  // FORMULARIO DE PROYECTO
  // -------------------------------------------------------
  private obtenerCambios(): ProyectoUpdate {
    const cambios: ProyectoUpdate = {};
    const campos: (keyof ProyectoUpdate)[] = [
      'nombre_proyecto',
      'empresa',
      'descripcion',
      'fecha_inicio',
      'fecha_fin',
    ];

    campos.forEach((campo) => {
      const actual = this.proyectoForm[campo] ?? null;
      const original = this.proyectoOriginal[campo] ?? null;

      const valActual = actual === null ? null : String(actual).trim();
      const valOriginal = original === null ? null : String(original).trim();

      if (valActual !== valOriginal) {
        if (campo === 'empresa') {
          cambios.empresa = this.proyectoForm.empresa ?? null;
        } else {
          cambios[campo] = valActual === '' ? null : (valActual as any);
        }
      }
    });

    return cambios;
  }

  private validarParcial(): boolean {
    this.errores = {};
    const nombre = (this.proyectoForm.nombre_proyecto ?? '').trim();
    const descripcion = (this.proyectoForm.descripcion ?? '')?.toString() ?? '';
    const inicio = this.proyectoForm.fecha_inicio ?? '';
    const fin = this.proyectoForm.fecha_fin ?? '';

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

  guardarCambios(): void {
    if (!this.id_proyecto) return;
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
    this.proyectoService.patchProyecto(this.id_proyecto, cambios).subscribe({
      next: (res) => {
        this.cargandoOperacion = false;
        this.message.showWarning('Proyecto actualizado correctamente.');
        this.modoEdicion = false;
        this.cargarProyecto();
      },
      error: (err) => {
        this.cargandoOperacion = false;
        console.error('Error actualizar proyecto', err);
        if (err.error && typeof err.error === 'object') {
          Object.keys(err.error).forEach((k) => {
            this.errores[k] = Array.isArray(err.error[k]) ? err.error[k][0] : String(err.error[k]);
          });
        } else {
          this.message.showWarning('Error al actualizar el proyecto.');
        }
      },
    });
  }

  eliminarProyecto(): void {
    if (!this.id_proyecto) return;
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;
    this.cargandoOperacion = true;
    this.proyectoService.deleteProyecto(this.id_proyecto).subscribe({
      next: () => {
        this.cargandoOperacion = false;
        this.message.showWarning('Proyecto eliminado.');
        this.router.navigate(['/ver-proyectos-admin']);
      },
      error: (err) => {
        this.cargandoOperacion = false;
        console.error('Error eliminar proyecto', err);
        this.message.showWarning('No se pudo eliminar el proyecto.');
      },
    });
  }
}
