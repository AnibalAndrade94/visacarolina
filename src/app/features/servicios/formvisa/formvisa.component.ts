import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-formvisa',
  templateUrl: './formvisa.component.html',
  styleUrls: ['./formvisa.component.scss']
})
export class FormvisaComponent implements OnInit {
  visaForm!: FormGroup;
  originalOrder = () => 0;
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

  
onSubmit() {
  console.log("se está enviando correo");
  console.log("es valido?", this.visaForm.valid)
  if (this.visaForm.valid) {
    this.http.post('http://localhost:3000/send', this.visaForm.value).subscribe({
      next: (res) => {
        console.log('Formulario enviado exitosamente', res);
        alert('¡Información enviada!');
        this.visaForm.reset();
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
