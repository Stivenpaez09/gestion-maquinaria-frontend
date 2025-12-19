import { Component } from '@angular/core';
import { SidebarOperador } from '../../../../../shared/components/sidebar-operador/sidebar-operador';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Alarma } from '../../../../../core/models/alarma.models';
import { AuthService } from '../../../../../core/services/auth.service';
import { AlarmaService } from '../../../../../core/services/alarma.service';
import { MessageService } from '../../../../../core/services/message.service';

@Component({
  selector: 'app-ver-alarmas-operador',
  imports: [RouterModule, CommonModule, SidebarOperador],
  templateUrl: './ver-alarmas-operador.html',
  styleUrl: './ver-alarmas-operador.scss',
})
export class VerAlarmasOperador {
  alarmas: Alarma[] = [];
  cargando = false;

  // paginación
  page = 1;
  perPage = 10;
  totalPages = 1;

  constructor(
    private authService: AuthService,
    private alarmaService: AlarmaService,
    private message: MessageService
  ) {}

  salir(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.cargarAlarmas();
  }

  cargarAlarmas(): void {
    this.cargando = true;
    this.alarmaService.getAlarmas().subscribe({
      next: (list) => {
        // ordenar descendente por fecha (lo más reciente primero)
        this.alarmas = (list || []).sort((a, b) => {
          const da = new Date(a.created_at || a.fecha_registro || 0).getTime();
          const db = new Date(b.created_at || b.fecha_registro || 0).getTime();
          return db - da;
        });
        this.totalPages = Math.max(1, Math.ceil(this.alarmas.length / this.perPage));
        this.page = 1;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.message?.showWarning?.('No se pudieron cargar las alarmas.');
      },
    });
  }

  getPageAlarms(): Alarma[] {
    const start = (this.page - 1) * this.perPage;
    return this.alarmas.slice(start, start + this.perPage);
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  trackByAlarmaId(_: number, a: Alarma): number {
    return a.id_alarma;
  }
}
