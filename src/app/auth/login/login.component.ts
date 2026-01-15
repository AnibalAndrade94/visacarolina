import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
 loading = false;
  submitted = false;
  errorMsg = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    rememberMe: [true],
  });

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  get f() { return this.form.controls; }

  submit() {
    this.submitted = true;
    this.errorMsg = '';

    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const payload = {
  email: (raw.email ?? '').trim().toLowerCase(),
  password: raw.password ?? '',
};

    this.loading = true;

    this.auth.login(payload, raw.rememberMe ?? true).subscribe({
      next: () => {
        this.loading = false;
        
        // TODO: aquí rediriges (router.navigate) a dashboard o a donde quieras
        // this.router.navigate(['/mi-cuenta']);
            console.log('TOKEN:', this.auth.getToken());
            localStorage.getItem('token')
sessionStorage.getItem('token')
      },
      error: (err) => {
        this.loading = false;
const details = err?.error?.details;
  if (Array.isArray(details) && details.length) {
    this.errorMsg = details.map((d: any) => d.msg).join(' • ');
    return;
  }
        // Mensajes típicos del backend
        const msg =
  err?.error?.error ||          // <- lo que manda tu backend
  err?.error?.message ||        // <- fallback por si luego cambias backend
  (err?.status === 401 ? 'Correo o contraseña incorrectos.' : '') ||
  (err?.status === 0 ? 'No se pudo conectar al servidor.' : '') ||
  'Ocurrió un error al iniciar sesión.';

        this.errorMsg = msg;
      }
    });
  }
}
