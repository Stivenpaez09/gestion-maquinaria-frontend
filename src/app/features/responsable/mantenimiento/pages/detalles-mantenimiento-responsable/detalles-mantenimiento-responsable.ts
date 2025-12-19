import { Component } from '@angular/core';
import { SidebarResponsable } from '../../../../../shared/components/sidebar-responsable/sidebar-responsable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mantenimiento } from '../../../../../core/models/mantenimiento-models';
import { Maquinaria } from '../../../../../core/models/maquinaria.models';
import { Usuario } from '../../../../../core/models/usuario.models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { MantenimientoService } from '../../../../../core/services/mantenimiento.service';
import { MaquinariaService } from '../../../../../core/services/maquinaria.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { MessageService } from '../../../../../core/services/message.service';
import { environment } from '../../../../../../environments/environment.prod';

@Component({
  selector: 'app-detalles-mantenimiento-responsable',
  imports: [CommonModule, FormsModule, SidebarResponsable],
  templateUrl: './detalles-mantenimiento-responsable.html',
  styleUrl: './detalles-mantenimiento-responsable.scss',
})
export class DetallesMantenimientoResponsable {
  // estado
  cargando = false;
  cargandoOperacion = false;
  cargandoEliminacion = false;
  mostrarConfirmacionEliminar = false;

  // ids y modelos
  id_mantenimiento: number | null = null;
  mantenimiento: Mantenimiento | null = null;
  maquinaObj: Maquinaria | null = null;
  usuarioObj: Usuario | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private mantenimientoService: MantenimientoService,
    private maquinariaService: MaquinariaService,
    private usuarioService: UsuarioService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.id_mantenimiento = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id_mantenimiento) {
      this.cargarMantenimiento();
    }
  }

  salir(): void {
    this.authService.logout();
  }

  // -------------------------------------------------------
  // CARGAR
  // -------------------------------------------------------
  cargarMantenimiento(): void {
    if (!this.id_mantenimiento) return;

    this.cargando = true;
    this.mantenimientoService.obtenerPorId(this.id_mantenimiento).subscribe({
      next: (m) => {
        this.mantenimiento = m;

        this.maquinaObj = null;
        this.usuarioObj = null;

        if (m.maquina) {
          this.maquinariaService.getMaquinariaById(m.maquina).subscribe({
            next: (mq) => (this.maquinaObj = mq),
            error: () => (this.maquinaObj = null),
          });
        }

        if (m.usuario) {
          this.usuarioService.getUsuarioById(m.usuario).subscribe({
            next: (u) => (this.usuarioObj = u),
            error: () => (this.usuarioObj = null),
          });
        }

        this.cargando = false;
      },
      error: () => {
        this.message.showWarning('No se pudo cargar el mantenimiento.');
        this.cargando = false;
      },
    });
  }

  navegarALista(): void {
    this.router.navigate(['/ver-mantenimientos-responsable']);
  }

  obtenerFotoUrl(foto?: string | null): string {
    if (!foto) return '/assets/images/mantenimiento-default.jpg';

    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    return `${baseUrl}${foto}`;
  }
}
