import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.http.post('http://localhost:3000/send-contacto', this.contactForm.value).subscribe({
        next: () => {
          alert('¡Tu mensaje fue enviado con éxito!');
          this.contactForm.reset();
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
