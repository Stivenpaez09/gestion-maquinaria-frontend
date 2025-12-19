import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { ConductorService } from '../../../../../core/services/conductor.service';
import { Conductor } from '../../../../../core/models/conductor.models';
import { MessageService } from '../../../../../core/services/message.service';
import { SidebarAdmin } from '../../../../../shared/components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-ver-conductores-admin',
  imports: [CommonModule, RouterLink, FormsModule, SidebarAdmin],
  templateUrl: './ver-conductores-admin.html',
  styleUrl: './ver-conductores-admin.scss',
})
export class VerConductoresAdmin implements OnInit {
  conductores: Conductor[] = [];
  cargando = false;
  buscando = false;
  searchTerm = '';

  constructor(
    private authService: AuthService,
    private conductorService: ConductorService,
    private router: Router,
    private message: MessageService
  ) {}

  salir(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.cargarConductores();
  }

  cargarConductores(): void {
    this.cargando = true;
    this.conductorService.listar().subscribe({
      next: (list) => {
        this.conductores = list || [];
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        console.error(err);
        this.message?.showWarning?.('No se pudieron cargar los conductores.');
      },
    });
  }

  buscar(): void {
    const q = (this.searchTerm || '').trim();
    if (!q) {
      this.cargarConductores();
      return;
    }
    this.buscando = true;
    // filtrar por licencia en frontend (si API no soporta búsqueda)
    // se asume listar trae todos; si tienes endpoint de búsqueda reemplazar por llamada al servicio.
    this.conductorService.listar().subscribe({
      next: (list) => {
        this.conductores = (list || []).filter((c) =>
          String(c.licencia).toLowerCase().includes(q.toLowerCase())
        );
        this.buscando = false;
      },
      error: (err) => {
        this.buscando = false;
        console.error(err);
        this.message?.showWarning?.('Error al buscar conductores.');
      },
    });
  }

  verDetalle(conductor: Conductor): void {
    this.router.navigate(['/detalles-conductor-admin', conductor.id_conductor]);
  }
}
