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
    // Firebase manda algo como:
    // ?mode=verifyEmail&oobCode=XXXX&apiKey=...&continueUrl=...
    const mode = this.route.snapshot.queryParamMap.get('mode') || '';
    const oobCode = this.route.snapshot.queryParamMap.get('oobCode') || '';

    if (mode !== 'verifyEmail' || !oobCode) {
      this.loading = false;
      this.status = 'missing';
      this.message = 'El enlace de confirmación es inválido o está incompleto.';
      return;
    }

    this.auth.confirmEmailFirebase(oobCode).subscribe({
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

        // Firebase errores típicos: auth/invalid-action-code, auth/expired-action-code
        const code = err?.code || err?.error?.code;

        if (code === 'auth/expired-action-code') {
          this.message = 'El enlace expiró. Solicita uno nuevo desde el login.';
        } else if (code === 'auth/invalid-action-code') {
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
