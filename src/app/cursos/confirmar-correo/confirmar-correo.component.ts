import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-confirmar-correo',
  templateUrl: './confirmar-correo.component.html',
  styleUrls: ['./confirmar-correo.component.scss']
})
export class ConfirmarCorreoComponent implements OnInit{
 loading = true;
  status: 'success' | 'error' | 'missing' = 'missing';
  message = 'Procesando...';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') || '';
    const email = this.route.snapshot.queryParamMap.get('email') || '';

    if (!token || !email) {
      this.loading = false;
      this.status = 'missing';
      this.message = 'Faltan datos en el enlace de confirmación.';
      return;
    }

    this.auth.verifyEmail(token, email).subscribe({
      next: () => {
        this.loading = false;
        this.status = 'success';
        this.message = 'Tu correo fue confirmado correctamente ✅';

        Swal.fire({
          icon: 'success',
          title: 'Correo confirmado',
          text: 'Ya puedes iniciar sesión.',
          confirmButtonText: 'Ir a iniciar sesión'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        this.loading = false;
        this.status = 'error';

        const msg =
          err?.error?.error ||
          err?.error?.message ||
          'El enlace es inválido o ya expiró.';

        this.message = msg;

        Swal.fire({
          icon: 'error',
          title: 'No se pudo confirmar',
          text: msg,
          confirmButtonText: 'Volver al registro'
        }).then(() => {
          this.router.navigate(['/register']);
        });
      }
    });
  }
}
