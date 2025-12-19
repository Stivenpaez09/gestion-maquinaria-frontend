import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterModule, RouterLink],
  templateUrl: './sidebar-admin.html',
  styleUrl: './sidebar-admin.scss',
})
export class SidebarAdmin {
  constructor(private authService: AuthService, private router: Router) {}

  salir(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
