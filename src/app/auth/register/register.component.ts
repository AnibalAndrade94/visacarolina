import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


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
    whatsapp: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]], // 10-15 dígitos, opcional +
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    acceptTerms: [false, [Validators.requiredTrue]],

    // opcional
    source: [''],
    interest: [''], // opcional recomendado
  });

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  get f() { return this.form.controls; }

  normalizeWhatsApp(value: string) {
    // deja solo dígitos y + inicial si existe
    const trimmed = (value || '').trim();
    const hasPlus = trimmed.startsWith('+');
    const digits = trimmed.replace(/[^\d]/g, '');
    return hasPlus ? `+${digits}` : digits;
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

     const payload = {
    name: (raw.fullName ?? '').trim(),
    city: (raw.city ?? '').trim(),
    state: (raw.state ?? '').trim(),
    whatsapp: this.normalizeWhatsApp(raw.whatsapp || ''),
    email: (raw.email ?? '').trim().toLowerCase(),
    password: raw.password ?? '',
    acceptTerms: !!raw.acceptTerms,
    source: raw.source || undefined,
    interest: raw.interest || undefined,
  };

    this.loading = true;

    // TODO: aquí conectas tu AuthService.register(payload)
    this.auth.register(payload, true).subscribe({
  next: () => {
    this.loading = false;

    this.successMsg = 'Registro exitoso 🎉 Bienvenido a VisaCarolina';
    this.errorMsg = '';

    // Redirige después de 1.5s (opcional)
    setTimeout(() => {
      // this.router.navigate(['/mi-cuenta']);
    }, 1500);
  },
  error: (err) => {
    this.loading = false;
    this.successMsg = '';

    // Mensajes del backend
    const details = err?.error?.details;
    if (Array.isArray(details) && details.length) {
      this.errorMsg = details.map((d: any) => d.msg).join(' • ');
      return;
    }

    this.errorMsg =
      err?.error?.error ||
      err?.error?.message ||
      'No se pudo completar el registro.';
  }
});
  }
}
