import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-responsable',
  imports: [RouterModule, RouterLink],
  templateUrl: './sidebar-responsable.html',
  styleUrl: './sidebar-responsable.scss',
})
export class SidebarResponsable {
  constructor(private authService: AuthService, private router: Router) {}

  salir(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
