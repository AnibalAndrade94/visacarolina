import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
loading = false;
  submitted = false;
successMsg = '';
errorMsg = '';
  // Si tienes una lista de estados en un archivo, mejor; aquí va corta de ejemplo
  states = [
    'Aguascalientes','Baja California','Baja California Sur','Campeche','CDMX','Chiapas','Chihuahua',
    'Coahuila','Colima','Durango','Guanajuato','Guerrero','Hidalgo','Jalisco','Estado de México',
    'Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo',
    'San Luis Potosí','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas'
  ];

  sources = [
    'Facebook',
    'Instagram',
    'TikTok',
    'YouTube',
    'Recomendación',
    'Google',
    'Otro'
  ];

  form = this.fb.group({
  fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
  city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
  state: ['', [Validators.required]],
  whatsapp: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
  email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
  password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
  confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
  acceptTerms: [false, [Validators.requiredTrue]],

  source: [''],
  interest: [''],
}, { validators: [RegisterComponent.passwordsMatchValidator] });

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  get f() { return this.form.controls; }
 static passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!pass || !confirm) return null;
    return pass === confirm ? null : { passwordMismatch: true };
  }
  normalizeWhatsApp(value: string) {
    // deja solo dígitos y + inicial si existe
    const trimmed = (value || '').trim();
    const hasPlus = trimmed.startsWith('+');
    const digits = trimmed.replace(/[^\d]/g, '');
    return hasPlus ? `+${digits}` : digits;
  }
 private showMissingFieldsPopup() {
    // Mensaje simple. Si quieres listar campos específicos, lo hacemos después.
    Swal.fire({
      icon: 'warning',
      title: 'Faltan datos',
      text: 'Revisa los campos marcados y vuelve a intentar.',
      confirmButtonText: 'Ok'
    });
  }

   submit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      // Caso especial: contraseñas no coinciden
      if (this.form.hasError('passwordMismatch')) {
        Swal.fire({
          icon: 'warning',
          title: 'Las contraseñas no coinciden',
          text: 'Verifica la confirmación de contraseña.',
          confirmButtonText: 'Ok'
        });
        return;
      }

      this.showMissingFieldsPopup();
      return;
    }

    const raw = this.form.getRawValue();

    const payload = {
      name: (raw.fullName ?? '').trim(),
      city: (raw.city ?? '').trim(),
      state: (raw.state ?? '').trim(),
      whatsapp: this.normalizeWhatsApp(raw.whatsapp || ''),
      email: (raw.email ?? '').trim().toLowerCase(),
      password: raw.password ?? '',
      acceptTerms: !!raw.acceptTerms,
      source: (raw.source ?? '').trim(),
      interest: (raw.interest ?? '').trim(),
    };

    this.loading = true;

    this.auth.register(payload, true).subscribe({
      next: () => {
        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Tu cuenta fue creada correctamente.',
          confirmButtonText: 'Continuar'
        });

        // Si quieres redirigir aquí, lo hacemos cuando tengas la ruta
        // this.router.navigate(['/mi-cuenta']);
      },
      error: (err) => {
        this.loading = false;

        if (err?.status === 409) {
          Swal.fire({
            icon: 'info',
            title: 'Correo ya registrado',
            text: 'Ya existe una cuenta con ese correo. Inicia sesión.',
            confirmButtonText: 'Ok'
          });
          return;
        }

        // Validaciones del backend (express-validator)
        const details = err?.error?.details;
        if (Array.isArray(details) && details.length) {
          Swal.fire({
            icon: 'warning',
            title: 'Datos inválidos',
            text: details.map((d: any) => d.msg).join(' • '),
            confirmButtonText: 'Ok'
          });
          return;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.error || 'No se pudo completar el registro.',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
}
