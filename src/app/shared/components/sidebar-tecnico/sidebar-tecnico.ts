import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-tecnico',
  imports: [RouterModule, RouterLink],
  templateUrl: './sidebar-tecnico.html',
  styleUrl: './sidebar-tecnico.scss',
})
export class SidebarTecnico {
  constructor(private authService: AuthService, private router: Router) {}

  salir(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
