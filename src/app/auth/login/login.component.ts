import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
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

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Revisa los campos marcados y vuelve a intentar.',
        confirmButtonText: 'Ok'
      });
      return;
    }

    const raw = this.form.getRawValue();

    const payload = {
      email: (raw.email ?? '').trim().toLowerCase(),
      password: raw.password ?? '',
    };

    this.loading = true;

    this.auth.login(payload, raw.rememberMe ?? true).subscribe({
      next: (_resp: any) => {
        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Sesión iniciada correctamente.',
          confirmButtonText: 'Ok'
        });

        // Aquí ya puedes navegar:
        // this.router.navigate(['/mi-cuenta']);
      },
      error: (err) => {
        this.loading = false;

        const code = err?.code || err?.error?.code;

        // Firebase Auth errores comunes
        if (code === 'auth/user-not-found') {
          this.errorMsg = 'No existe una cuenta con ese correo.';
          return;
        }

        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
          this.errorMsg = 'Correo o contraseña incorrectos.';
          return;
        }

        if (code === 'auth/too-many-requests') {
          this.errorMsg = 'Demasiados intentos. Intenta de nuevo más tarde.';
          return;
        }

        if (code === 'auth/invalid-email') {
          this.errorMsg = 'Correo inválido.';
          return;
        }

        // Si falla el sync-profile (backend)
        if (err?.status === 401) {
          this.errorMsg = 'No se pudo validar tu sesión. Intenta de nuevo.';
          return;
        }
        if (code === 'auth/email-not-verified') {
  this.errorMsg = 'Primero confirma tu correo. Revisa tu bandeja y spam.';
  return;
}


        this.errorMsg = err?.message || 'Ocurrió un error al iniciar sesión.';
      }
    });
  }
}