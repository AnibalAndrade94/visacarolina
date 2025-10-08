import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AnalyticsService } from 'src/app/services/analytics.service';
declare var grecaptcha: any;

@Component({
  selector: 'app-formulario2',
  templateUrl: './formulario2.component.html',
  styleUrls: ['./formulario2.component.scss']
})
export class Formulario2Component implements OnInit, AfterViewInit {
  @Input() tramite: string = '';      // texto visible (ej. “Visa americana”)
  @Input() descuento: number = 0;
  @Input() tipoTramite: string = '';  // usa este para mapear endpoint (ej. 'visa-us', 'eta-uk', 'eta-ca', 'pasaporte-mx')
  @Input() codigo: string = '';
  @Input() index: number = 0;

  visaForm!: FormGroup;
  enviado = false;
  error = false;

  // === Ajusta a tu siteKey v2 (checkbox) ===
  siteKey = '6LeDZuArAAAAAMQIbKtQJ8V60ePbrjz4VTlQP9Oj';
  captchaToken = '';

  private api = environment.apiBaseUrl;

  constructor(private fb: FormBuilder, private http: HttpClient, public analytics: AnalyticsService) {
    this.analytics = analytics;
  }

  ngOnInit(): void {
    this.visaForm = this.fb.group({
      nombre: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      lugarNacimiento: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      curp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefonoCasa: ['', [Validators.pattern('^[0-9]{10,15}$')]],
      telefonoCelular: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    });
  }

  ngAfterViewInit(): void {
    // Render del captcha (usa un id único si hay varios formularios en la página)
    const id = `captcha-container-${this.index || 0}`;
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el && typeof grecaptcha !== 'undefined') {
        grecaptcha.render(id, {
          sitekey: this.siteKey,
          callback: (token: string) => (this.captchaToken = token),
        });
      }
    }, 300);
  }

  // id único para el template: <div [id]="'captcha-container-' + index"></div>
  get captchaContainerId() {
    return `captcha-container-${this.index || 0}`;
  }

  private endpointPorTramite(): string {
    // Normaliza
    const t = (this.tipoTramite || this.tramite || '').toLowerCase();

    if (t.includes('visa') && (t.includes('us') || t.includes('americana'))) {
      return `${this.api}/api/form-visa-americana`;
    }
    if (t.includes('pasaporte') && t.includes('mx')) {
      return `${this.api}/api/form-pasaporte-mx`;
    }
    if (t.includes('eta') && (t.includes('uk') || t.includes('reino'))) {
      return `${this.api}/api/form-eta-uk`;
    }
    if (t.includes('eta') && t.includes('canad')) {
      return `${this.api}/api/form-eta-canada`;
    }
    // Genérico
    return `${this.api}/api/send`;
  }

  enviarFormulario(): void {
    if (!this.captchaToken) {
      alert('Por favor, completa el reCAPTCHA.');
      return;
    }

    if (!this.visaForm.valid) {
      this.visaForm.markAllAsTouched();
      return;
    }

    // 1) valida captcha en backend
    this.http.post(`${this.api}/api/verify-captcha`, { token: this.captchaToken }).subscribe({
      next: () => {
        // 2) arma payload y envía al endpoint según trámite
        const datos = {
          tramite: this.tramite,
          descuento: this.descuento,
          tipoTramite: this.tipoTramite,
          codigo: this.codigo,
          ...this.visaForm.value,
          token: this.captchaToken,
        };

        const endpoint = this.endpointPorTramite();

        this.http.post(endpoint, datos).subscribe({
          next: () => {
            this.enviado = true;
            this.error = false;
            alert('¡Información enviada!');
            this.analytics.logEvent('form_submit', { form: 'fomr2', status: 'success' });
            this.visaForm.reset();
            if (typeof grecaptcha !== 'undefined') {
              try { grecaptcha.reset(); } catch {}
            }
            this.captchaToken = '';
          },
          error: (err) => {
            console.error('Error al enviar formulario2:', err);
            this.error = true;
            this.enviado = false;
            alert('Hubo un error al enviar. Intenta más tarde.');
          }
        });
      },
      error: (err) => {
        console.error('Captcha inválido en formulario2:', err);
        alert('Validación de reCAPTCHA falló. Intenta de nuevo.');
        if (typeof grecaptcha !== 'undefined') {
          try { grecaptcha.reset(); } catch {}
        }
        this.captchaToken = '';
      }
    });
  }
}
