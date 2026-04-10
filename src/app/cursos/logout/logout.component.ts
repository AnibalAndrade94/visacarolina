import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
constructor(
  private auth: AuthService,
  private router: Router
) {}

logout() {
  this.auth.logout();
  this.router.navigate(['/cursos/login']);
}
}
