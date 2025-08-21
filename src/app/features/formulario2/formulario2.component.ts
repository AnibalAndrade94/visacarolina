import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formulario2',
  templateUrl: './formulario2.component.html',
  styleUrls: ['./formulario2.component.scss']
})
export class Formulario2Component implements OnInit {
  @Input() tramite: string = '';
  @Input() descuento: number = 0;
  @Input() tipoTramite: string = '';
  @Input() codigo: string = '';
  @Input() index: number = 0;

  visaForm!: FormGroup; // <- Esto evita el error del HTML
  enviado = false;
  error = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.visaForm = this.fb.group({
      nombre: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      lugarNacimiento: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      curp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefonoCasa: ['', Validators.required],
      telefonoCelular: ['', Validators.required],
    });
  }

  enviarFormulario(): void {
    if (this.visaForm.valid) {
      const datos = {
        tramite: this.tramite,
        descuento: this.descuento,
        codigo: this.codigo,
        ...this.visaForm.value
      };

      this.http.post('https://tu-backend.com/guardar-tramite', datos).subscribe({
        next: () => {
          this.enviado = true;
          this.error = false;
        },
        error: () => {
          this.error = true;
          this.enviado = false;
        }
      });
    } else {
      this.visaForm.markAllAsTouched();
    }
  }
}
