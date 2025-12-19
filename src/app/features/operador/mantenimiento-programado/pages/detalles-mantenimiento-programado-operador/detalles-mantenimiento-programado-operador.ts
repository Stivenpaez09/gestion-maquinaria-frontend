import { Component } from '@angular/core';
import { SidebarOperador } from '../../../../../shared/components/sidebar-operador/sidebar-operador';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MantenimientoProgramado } from '../../../../../core/models/mantenimiento-programado.models';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { AuthService } from '../../../../../core/services/auth.service';
import { MantenimientoProgramadoService } from '../../../../../core/services/mantenimiento-programado.service';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { MessageService } from '../../../../../core/services/message.service';

@Component({
  selector: 'app-detalles-mantenimiento-programado-operador',
  imports: [CommonModule, FormsModule, RouterModule, RouterLink, SidebarOperador],
  templateUrl: './detalles-mantenimiento-programado-operador.html',
  styleUrl: './detalles-mantenimiento-programado-operador.scss',
})
export class DetallesMantenimientoProgramadoOperador {
  cargando = false;
  id_programado: number | null = null;
  mantenimiento: MantenimientoProgramado | null = null;
  maquinaObj: Maquinaria | null = null;

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
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargar mantenimiento', err);
        this.message.showWarning('No se pudo cargar el mantenimiento programado.');
        this.cargando = false;
      },
    });
  }
}
