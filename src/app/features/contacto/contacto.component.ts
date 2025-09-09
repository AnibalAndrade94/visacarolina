import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var grecaptcha: any;
declare global {
  interface Window {
    captchaResolved: (token: string) => void;
  }
}
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit{
  contactForm: FormGroup;
siteKey = '6LcgLEorAAAAAGK31QR006veAiVuKq3O5wfyhp4W'; // tu clave pública de reCAPTCHA v2

captchaToken: string = '';
constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }
ngOnInit() {
  // Si necesitas usar el callback desde el HTML directo
  window['captchaResolved'] = (token: string) => {
  this.captchaToken = token;
};
  // Por si el script no se ha cargado aún, lo insertamos manual

}
ngAfterViewInit(): void {
  setTimeout(() => {
    if (document.getElementById('captcha-container')) {
      grecaptcha.render('captcha-container', {
        sitekey: this.siteKey,
        callback: (token: string) => {
          this.captchaToken = token;
        }
      });
    }
  }, 500);
}
onCaptchaResolved(token: string) {
  this.captchaToken = token;
}



onSubmit(): void {
  if (!this.captchaToken) {
    alert('Por favor, completa el reCAPTCHA.');
    return;
  }

  if (this.contactForm.valid) {
    const payload = {
      ...this.contactForm.value,
      token: this.captchaToken // 👈 se incluye el token
    };

    this.http.post('https://visaback-ivory.vercel.app/send-contacto', payload).subscribe({
      next: () => {
        alert('¡Tu mensaje fue enviado con éxito!');
        this.contactForm.reset();
        grecaptcha.reset(); // 👈 Resetea el captcha
        this.captchaToken = '';
      },
      error: () => {
        alert('Hubo un problema. Intenta de nuevo más tarde.');
      }
    });
  } else {
    this.contactForm.markAllAsTouched();
  }
}
}
