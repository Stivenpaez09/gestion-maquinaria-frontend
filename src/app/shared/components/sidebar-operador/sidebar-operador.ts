import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-operador',
  imports: [RouterModule, RouterLink],
  templateUrl: './sidebar-operador.html',
  styleUrl: './sidebar-operador.scss',
})
export class SidebarOperador {
  constructor(private authService: AuthService, private router: Router) {}

  salir(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
