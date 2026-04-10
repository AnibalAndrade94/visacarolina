import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  get f() {
    return this.form.controls;
  }

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
      next: (_resp) => {
        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Sesión iniciada correctamente.',
          confirmButtonText: 'Ok'
        }).then(() => {
          this.router.navigate(['/cursos']);
        });
      },
      error: (err) => {
        this.loading = false;

        if (err?.status === 401) {
          this.errorMsg = 'Correo o contraseña incorrectos.';
          return;
        }

        if (err?.status === 403) {
          this.errorMsg = 'Primero confirma tu correo. Revisa tu bandeja y spam.';
          return;
        }

        if (err?.status === 404) {
          this.errorMsg = 'No se encontró la cuenta.';
          return;
        }

        this.errorMsg =
          err?.error?.error ||
          err?.error?.message ||
          'Ocurrió un error al iniciar sesión.';
      }
    });
  }
}