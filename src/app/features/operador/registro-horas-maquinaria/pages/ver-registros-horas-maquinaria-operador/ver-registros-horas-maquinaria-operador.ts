import { Component } from '@angular/core';
import { SidebarOperador } from '../../../../../shared/components/sidebar-operador/sidebar-operador';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  RegistroConDatos,
  RegistroHorasMaquinaria,
} from '../../../../../core/models/registro-horas-maquinaria';
import { Proyecto } from '../../../../../core/models/proyecto.models';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { RegistroHorasMaquinariaService } from '../../../../../core/services/registro-horas-maquinaria.service';
import { ProyectoService } from '../../../../../core/services/proyecto.service';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';

@Component({
  selector: 'app-ver-registros-horas-maquinaria-operador',
  imports: [CommonModule, RouterLink, FormsModule, SidebarOperador],
  templateUrl: './ver-registros-horas-maquinaria-operador.html',
  styleUrl: './ver-registros-horas-maquinaria-operador.scss',
})
export class VerRegistrosHorasMaquinariaOperador {
  // Datos
  registros: RegistroHorasMaquinaria[] = [];
  registrosConDatos: RegistroConDatos[] = [];
  registrosFiltrados: RegistroConDatos[] = [];
  proyectos: Proyecto[] = [];
  maquinarias: Maquinaria[] = [];

  // Búsqueda
  searchTerm: string = '';
  cargando: boolean = true;

  constructor(
    private registroService: RegistroHorasMaquinariaService,
    private proyectoService: ProyectoService,
    private maquinariaService: MaquinariaService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  // -------------------------------------------------------
  // CARGAR DATOS
  // -------------------------------------------------------
  cargarDatos(): void {
    this.cargando = true;

    // Cargar registros, proyectos y maquinarias en paralelo
    Promise.all([
      this.registroService.listar().toPromise(),
      this.proyectoService.getProyectos().toPromise(),
      this.maquinariaService.getMaquinarias().toPromise(),
    ])
      .then(([registros, proyectos, maquinarias]) => {
        this.registros = registros || [];
        this.proyectos = proyectos || [];
        this.maquinarias = maquinarias || [];

        // Enriquecer registros con datos relacionados
        this.registrosConDatos = this.registros.map((registro) => ({
          ...registro,
          proyectoData: this.proyectos.find((p) => p.id_proyecto === registro.proyecto) || null,
          maquinariaData: this.maquinarias.find((m) => m.id_maquina === registro.maquina) || null,
        }));

        this.registrosFiltrados = this.registrosConDatos;
        this.cargando = false;
      })
      .catch((error) => {
        console.error('Error al cargar datos:', error);
        this.cargando = false;
      });
  }

  // -------------------------------------------------------
  // BÚSQUEDA/FILTRADO
  // -------------------------------------------------------
  buscar(): void {
    if (!this.searchTerm.trim()) {
      this.registrosFiltrados = this.registrosConDatos;
      return;
    }

    const termino = this.searchTerm.toLowerCase();
    this.registrosFiltrados = this.registrosConDatos.filter((registro) => {
      const nombreProyecto = registro.proyectoData?.nombre_proyecto?.toLowerCase() || '';
      return nombreProyecto.includes(termino);
    });
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.registrosFiltrados = this.registrosConDatos;
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
}
