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
  selector: 'app-formvisa',
  templateUrl: './formvisa.component.html',
  styleUrls: ['./formvisa.component.scss']
})
export class FormvisaComponent implements OnInit {
  visaForm!: FormGroup;
  originalOrder = () => 0;
  siteKey = '6LcgLEorAAAAAGK31QR006veAiVuKq3O5wfyhp4W'; // tu clave pública de reCAPTCHA v2
captchaToken: string = '';

  campos: { campo: string; nombre: string }[] = [
    // Información Personal
    { campo: 'nombre', nombre: 'Nombre' },
    { campo: 'estadoCivil', nombre: 'Estado Civil' },
    { campo: 'lugarNacimiento', nombre: 'Lugar de Nacimiento' },
    { campo: 'fechaNacimiento', nombre: 'Fecha de Nacimiento' },
    { campo: 'sexo', nombre: 'Sexo' },
    { campo: 'curp', nombre: 'CURP' },
    { campo: 'email', nombre: 'Correo Electrónico' },
    { campo: 'direccionCasa', nombre: 'Dirección de Casa' },
    { campo: 'telefonoCasa', nombre: 'Teléfono de Casa' },
    { campo: 'telefonoCelular', nombre: 'Teléfono Celular' },
  
    // Información de Viaje
    { campo: 'numeroPasaporte', nombre: 'Número de Pasaporte' },
    { campo: 'numeroVisa', nombre: 'Número de Visa (Si Aplica)' },
    { campo: 'huellasTomadas', nombre: '¿Le Han Tomado Huellas en Frontera o Visa?' },
    { campo: 'fechaUltimoViaje', nombre: 'Fecha de Último Viaje a EUA' },
    { campo: 'personasViajan', nombre: 'Personas que Viajan con Usted' },
  
    // Información Familiar
    { campo: 'nombrePadre', nombre: 'Nombre del Padre' },
    { campo: 'fechaNacimientoPadre', nombre: 'Fecha de Nacimiento del Padre' },
    { campo: 'nombreMadre', nombre: 'Nombre de la Madre' },
    { campo: 'fechaNacimientoMadre', nombre: 'Fecha de Nacimiento de la Madre' },
    { campo: 'nombreConyuge', nombre: 'Nombre del Cónyuge' },
    { campo: 'lugarNacimientoConyuge', nombre: 'Lugar de Nacimiento del Cónyuge' },
    { campo: 'fechaNacimientoConyuge', nombre: 'Fecha de Nacimiento del Cónyuge' },
  
    // Información Profesional
    { campo: 'estudia', nombre: '¿Estudia?' },
    { campo: 'trabaja', nombre: '¿Trabaja?' },
    { campo: 'nombreEscuela', nombre: 'Nombre de la Escuela' },
    { campo: 'direccionEscuela', nombre: 'Dirección de la Escuela' },
    { campo: 'nombreEmpresa', nombre: 'Nombre de la Empresa' },
    { campo: 'puesto', nombre: 'Puesto' },
    { campo: 'sueldo', nombre: 'Sueldo' },
    { campo: 'descripcionPuesto', nombre: 'Descripción del Puesto' },
  
    // Información Adicional de Viaje
    { campo: 'fechaProbableViaje', nombre: 'Fecha Probable del Viaje' },
    { campo: 'lugarLlegadaEU', nombre: 'Lugar de Llegada a EUA' },
    { campo: 'nombreHotel', nombre: 'Nombre del Hotel' },
    { campo: 'direccionHotel', nombre: 'Dirección del Hotel' },
    { campo: 'visitaFamiliaEmpresa', nombre: 'Datos de Contacto en EUA (Familia o Empresa)' },
    { campo: 'tieneFamiliaEnEU', nombre: '¿Tiene Familiares en EUA?' },
    { campo: 'viajesOtrosPaises', nombre: '¿Ha Viajado a Otros Países en los Últimos 5 Años?' }
  ];
  
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    window['captchaResolved'] = (token: string) => {
  this.captchaToken = token;
};
  // Por si el script no se ha cargado aún, lo insertamos manual
  if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
    this.visaForm = this.fb.group({
      // Información Personal
      nombre: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      lugarNacimiento: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required], // nuevo campo select
      curp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccionCasa: [''],
      telefonoCasa: ['', Validators.pattern('^[0-9]{10,15}$')], // input tipo tel
      telefonoCelular: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    
      // Información de Viaje
      numeroPasaporte: [''],
      numeroVisa: [''],
      huellasTomadas: [''],
      fechaUltimoViaje: [''],
      personasViajan: [''],
    
      // Información Familiar
      nombrePadre: [''],
      fechaNacimientoPadre: [''],
      nombreMadre: [''],
      fechaNacimientoMadre: [''],
      nombreConyuge: [''],
      lugarNacimientoConyuge: [''],
      fechaNacimientoConyuge: [''],
    
      // Información Profesional
      estudia: [false], // checkbox
      trabaja: [false], // checkbox
      nombreEscuela: [{ value: '', disabled: true }], // solo habilitado si estudia
      direccionEscuela: [{ value: '', disabled: true }],
      nombreEmpresa: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      sueldo: [{ value: '', disabled: true }],
      descripcionPuesto: [{ value: '', disabled: true }],
    
      // Información Adicional de Viaje
      fechaProbableViaje: [''],
      lugarLlegadaEU: [''],
      nombreHotel: [''],
      direccionHotel: [''],
      visitaFamiliaEmpresa: [''],
      tieneFamiliaEnEU: [''],
      viajesOtrosPaises: ['']
    });
    
  }

  onCaptchaResolved(token: string) {
  this.captchaToken = token;
}

onSubmit() {
  console.log("se está enviando correo");
  console.log("es valido?", this.visaForm.valid);

  // 👀 Validar que el reCAPTCHA esté resuelto
  if (!this.captchaToken) {
    alert('Por favor, completa el reCAPTCHA.');
    return;
  }

  if (this.visaForm.valid) {
    const payload = {
      ...this.visaForm.value,
      token: this.captchaToken // 👈 incluir el token para el backend
    };

    this.http.post('https://visaback-production.up.railway.app/send', payload).subscribe({
      next: (res) => {
        console.log('Formulario enviado exitosamente', res);
        alert('¡Información enviada!');
        this.visaForm.reset();
        grecaptcha.reset();     // 👈 reinicia visualmente el captcha
        this.captchaToken = ''; // 👈 limpia el token
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
