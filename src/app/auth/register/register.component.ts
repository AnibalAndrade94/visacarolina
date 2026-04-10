import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  loading = false;
  submitted = false;
  errorMsg = '';

  states = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
    'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
    'Yucatán', 'Zacatecas'
  ];

  sources = [
    'Instagram',
    'Facebook',
    'TikTok',
    'Google',
    'Recomendación',
    'Otro'
  ];

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      whatsapp: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      source: [''],
      interest: [''],
      acceptTerms: [false, [Validators.requiredTrue]],
      rememberMe: [true]
    },
    { validators: passwordMatchValidator }
  );

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
        text: 'Completa correctamente los campos obligatorios.',
        confirmButtonText: 'Ok'
      });
      return;
    }

    const raw = this.form.getRawValue();

    const payload = {
      name: (raw.name ?? '').trim(),
      city: (raw.city ?? '').trim(),
      state: (raw.state ?? '').trim(),
      whatsapp: String(raw.whatsapp ?? '').trim(),
      email: (raw.email ?? '').trim().toLowerCase(),
      password: raw.password ?? '',
      acceptTerms: !!raw.acceptTerms,
      source: (raw.source ?? '').trim(),
      interest: (raw.interest ?? '').trim()
    };

    this.loading = true;

    this.auth.register(payload, raw.rememberMe ?? true).subscribe({
      next: (resp) => {
        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: resp?.message || 'Revisa tu correo para confirmar tu cuenta.',
          confirmButtonText: 'Ir a iniciar sesión'
        }).then(() => {
          this.router.navigate(['/cursos/login']);
        });
      },
      error: (err) => {
        this.loading = false;

        if (err?.status === 409) {
          this.errorMsg = 'Ya existe una cuenta con este correo.';
          return;
        }

        if (err?.status === 400) {
          this.errorMsg = err?.error?.error || 'Datos inválidos. Revisa el formulario.';
          return;
        }

        this.errorMsg =
          err?.error?.error ||
          err?.error?.message ||
          'Ocurrió un error al registrarte.';
      }
    });
  }
}