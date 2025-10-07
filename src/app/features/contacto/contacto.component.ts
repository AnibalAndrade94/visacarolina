import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

declare var grecaptcha: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  // Usa la misma siteKey v2 (checkbox) que ya confirmaste
  siteKey = '6LeDZuArAAAAAMQIbKtQJ8V60ePbrjz4VTlQP9Oj';
  captchaToken = '';

  private api = environment.apiBaseUrl;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  ngOnInit() {
    (window as any).captchaResolved = (token: string) => (this.captchaToken = token);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const el = document.getElementById('captcha-container');
      if (el && typeof grecaptcha !== 'undefined') {
        grecaptcha.render('captcha-container', {
          sitekey: this.siteKey,
          callback: (token: string) => (this.captchaToken = token)
        });
      }
    }, 300);
  }

  onSubmit(): void {
    if (!this.captchaToken) {
      alert('Por favor, completa el reCAPTCHA.');
      return;
    }

    if (!this.contactForm.valid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // 1) verificar captcha en backend
    this.http.post(`${this.api}/api/verify-captcha`, { token: this.captchaToken }).subscribe({
      next: () => {
        // 2) enviar mensaje de contacto
        const payload = {
          ...this.contactForm.value,
          token: this.captchaToken
        };

        this.http.post(`${this.api}/api/send-contacto`, payload).subscribe({
          next: () => {
            alert('¡Tu mensaje fue enviado con éxito!');
            this.contactForm.reset();
            if (typeof grecaptcha !== 'undefined') {
              try { grecaptcha.reset(); } catch {}
            }
            this.captchaToken = '';
          },
          error: (error) => {
            console.error('Error /send-contacto:', error);
            alert('Hubo un problema al enviar. Intenta de nuevo más tarde.');
          }
        });
      },
      error: (err) => {
        console.error('Captcha inválido:', err);
        alert('Validación de reCAPTCHA falló. Intenta de nuevo.');
        if (typeof grecaptcha !== 'undefined') {
          try { grecaptcha.reset(); } catch {}
        }
        this.captchaToken = '';
      }
    });
  }
}
