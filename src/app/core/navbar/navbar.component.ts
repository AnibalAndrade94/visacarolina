import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get currentUser() {
    return this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/cursos/login']);
  }
}