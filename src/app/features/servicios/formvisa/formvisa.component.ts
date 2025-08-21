import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var grecaptcha: any;
declare global {
  interface Window {
    captchaResolved: (token: string) => void;
  }
}

@Component({
  selector: 'app-formvisa',
  templateUrl: './formvisa.component.html',
  styleUrls: ['./formvisa.component.scss']
})
export class FormvisaComponent implements OnInit {
  visaForm!: FormGroup;
  originalOrder = () => 0;
  siteKey = '6LcgLEorAAAAAGK31QR006veAiVuKq3O5wfyhp4W';
  captchaToken: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    window['captchaResolved'] = (token: string) => {
      this.captchaToken = token;
    };

    this.visaForm = this.fb.group({
      // Información Personal
      nombre: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      lugarNacimiento: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      curp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccionCasa: [''],
      telefonoCasa: ['', Validators.pattern('^[0-9]{10,15}$')],
      telefonoCelular: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],

      // Información de Viaje
      numeroPasaporte: ['',],
      pasaporteVigencia: ['',],
      fechaProbableViaje: [''],
      lugarLlegadaEU: [''],
      direccionUSA: ['',],
      telefonoUSA: ['', ],
      cpUSA: ['',],
      nombreHotel: [''],
      direccionHotel: [''],
      visitaFamiliaEmpresa: [''],
      tieneFamiliaEnEU: [''],
      viajesOtrosPaises: [''],
      fechaUltimoViaje: [''],
      haViajadoUSA: [''],
      fechasViaje: [''],

      // Visa
      numeroVisa: [''],
      fechaValidezVisa: [''],
      visaOtorgada: [''],
      visaRevocada: [''],
      huellasTomadas: [''],

      // Viaja acompañado
      viajaAcompanado: [''],
      acompanantes: this.fb.array([]),
        personasViajan: [''],

  // Padres
  padresEnUSA: [''],

  // Visa previa
  tieneVisa: [''],
  numeroVisaExtra: [''], // para el input condicional

      // Redes sociales
      redesSociales: this.fb.group({
        usaRedes: [],
        plataforma: [''],
        link: ['',]
      }),

      // Información Familiar
      nombrePadre: [''],
      fechaNacimientoPadre: [''],
      nombreMadre: [''],
      fechaNacimientoMadre: [''],
      nombreConyuge: [''],
      lugarNacimientoConyuge: [''],
      fechaNacimientoConyuge: [''],

      // Información Profesional
      estudia: [false],
      trabaja: [false],
      nombreEscuela: [{ value: '', disabled: true }],
      direccionEscuela: [{ value: '', disabled: true }],
      nombreEmpresa: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      sueldo: [{ value: '', disabled: true }],
      descripcionPuesto: [{ value: '', disabled: true }],

      // Dirección actual
      direccionActual: [''],
      cpActual: ['']
    });
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

  get acompanantes() {
    return this.visaForm.get('acompanantes') as FormArray;
  }

  agregarAcompanante() {
    const acomp = this.fb.group({
      nombre: ['', Validators.required],
      parentesco: ['', Validators.required]
    });
    this.acompanantes.push(acomp);
  }

  eliminarAcompanante(i: number) {
    this.acompanantes.removeAt(i);
  }

  onCaptchaResolved(token: string) {
    this.captchaToken = token;
  }

  onSubmit() {

    Object.keys(this.visaForm.controls).forEach(key => {
  const control = this.visaForm.get(key);
  if (control?.invalid) {
    console.log('Campo inválido:', key, control.errors);
  }
});
    console.log('se está enviando correo',this.visaForm);
    console.log('es valido?', this.visaForm.valid);

    if (!this.captchaToken) {
      alert('Por favor, completa el reCAPTCHA.');
      return;
    }

    if (this.visaForm.valid) {
      const payload = {
        ...this.visaForm.value,
        token: this.captchaToken
      };

      this.http.post('https://visaback-production.up.railway.app/send', payload).subscribe({
        next: (res) => {
          console.log('Formulario enviado exitosamente', res);
          alert('¡Información enviada!');
          this.visaForm.reset();
          grecaptcha.reset();
          this.captchaToken = '';
        },
        error: (err) => {
          console.error('Error al enviar el formulario', err);
          alert('Hubo un error al enviar. Intenta más tarde.');
        }
      });
    } else {
      this.visaForm.markAllAsTouched();
    }
  }

  onCheckChange(type: 'estudia' | 'trabaja') {
    const estudia = this.visaForm.get('estudia')?.value;
    const trabaja = this.visaForm.get('trabaja')?.value;

    if (type === 'estudia') {
      if (estudia) {
        this.visaForm.get('nombreEscuela')?.enable();
        this.visaForm.get('direccionEscuela')?.enable();
      } else {
        this.visaForm.get('nombreEscuela')?.disable();
        this.visaForm.get('direccionEscuela')?.disable();
        this.visaForm.get('nombreEscuela')?.reset();
        this.visaForm.get('direccionEscuela')?.reset();
      }
    }

    if (type === 'trabaja') {
      if (trabaja) {
        this.visaForm.get('nombreEmpresa')?.enable();
        this.visaForm.get('puesto')?.enable();
        this.visaForm.get('sueldo')?.enable();
        this.visaForm.get('descripcionPuesto')?.enable();
      } else {
        this.visaForm.get('nombreEmpresa')?.disable();
        this.visaForm.get('puesto')?.disable();
        this.visaForm.get('sueldo')?.disable();
        this.visaForm.get('descripcionPuesto')?.disable();
        this.visaForm.get('nombreEmpresa')?.reset();
        this.visaForm.get('puesto')?.reset();
        this.visaForm.get('sueldo')?.reset();
        this.visaForm.get('descripcionPuesto')?.reset();
      }
    }
  }
}
