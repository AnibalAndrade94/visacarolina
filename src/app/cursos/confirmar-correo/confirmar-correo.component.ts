import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirmar-correo',
  templateUrl: './confirmar-correo.component.html',
  styleUrls: ['./confirmar-correo.component.scss']
})
export class ConfirmarCorreoComponent implements OnInit {
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
      this.message = 'El enlace de confirmación es inválido o está incompleto.';
      return;
    }

    this.auth.verifyEmail(token, email).subscribe({
      next: () => {
        this.loading = false;
        this.status = 'success';
        this.message = 'Correo confirmado correctamente ✅';

        Swal.fire({
          icon: 'success',
          title: 'Correo confirmado',
          text: 'Tu correo fue verificado. Ya puedes iniciar sesión.',
          confirmButtonText: 'Ir a iniciar sesión'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.status = 'error';

        const backendMsg = err?.error?.error || err?.error?.message || '';

        if (backendMsg.toLowerCase().includes('expirado')) {
          this.message = 'El enlace expiró. Solicita uno nuevo.';
        } else if (backendMsg.toLowerCase().includes('inválido')) {
          this.message = 'El enlace es inválido o ya fue usado.';
        } else {
          this.message = 'No se pudo confirmar el correo. Intenta de nuevo.';
        }

        Swal.fire({
          icon: 'error',
          title: 'No se pudo confirmar',
          text: this.message,
          confirmButtonText: 'Ok'
        });
      }
    });
  }
}