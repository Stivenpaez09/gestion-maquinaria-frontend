import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../../../../core/models/proyecto.models';
import { ProyectoService } from '../../../../../core/services/proyecto.service';
import { MessageService } from '../../../../../core/services/message.service';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-ver-proyectos-admin',
  imports: [CommonModule, RouterLink, FormsModule, SidebarAdmin],
  templateUrl: './ver-proyectos-admin.html',
  styleUrl: './ver-proyectos-admin.scss',
})
export class VerProyectosAdmin implements OnInit {
  // Datos
  proyectos: Proyecto[] = [];
  proyectosFiltrados: Proyecto[] = [];

  // Búsqueda
  searchTerm: string = '';
  cargando: boolean = true;

  constructor(private proyectoService: ProyectoService, private message: MessageService) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  // -------------------------------------------------------
  // CARGAR PROYECTOS
  // -------------------------------------------------------
  cargarProyectos(): void {
    this.cargando = true;
    this.proyectoService.getProyectos().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.proyectosFiltrados = proyectos;
        this.cargando = false;
      },
      error: (error) => {
        this.message.showWarning('Error al cargar proyectos');
        console.error('Error:', error);
        this.cargando = false;
      },
    });
  }

  // -------------------------------------------------------
  // BÚSQUEDA/FILTRADO
  // -------------------------------------------------------
  buscar(): void {
    if (!this.searchTerm.trim()) {
      this.proyectosFiltrados = this.proyectos;
      return;
    }

    const termino = this.searchTerm.toLowerCase();
    this.proyectosFiltrados = this.proyectos.filter((proyecto) =>
      proyecto.nombre_proyecto.toLowerCase().includes(termino)
    );
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.proyectosFiltrados = this.proyectos;
  }

  // -------------------------------------------------------
  // ELIMINAR PROYECTO
  // -------------------------------------------------------
  eliminarProyecto(id: number, nombre: string): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar el proyecto "${nombre}"?`)) {
      return;
    }

    this.proyectoService.deleteProyecto(id).subscribe({
      next: () => {
        this.message.showWarning('Proyecto eliminado exitosamente.');
        this.cargarProyectos();
      },
      error: (error) => {
        this.message.showWarning(error.error?.detail || 'Error al eliminar proyecto.');
      },
    });
  }
}
