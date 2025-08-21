import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-codigos',
  templateUrl: './admin-codigos.component.html',
  styleUrls: ['./admin-codigos.component.scss']
})
export class AdminCodigosComponent implements OnInit {
  codigos: any[] = [];
  codigoForm!: FormGroup;
  apiUrl = 'https://visaback-production-e6bf.up.railway.app/api/codigos';
  // ← Cambia por tu URL real si es diferente visaback.railway.internal


  editando: boolean = false;
  codigoEditandoId: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.codigoForm = this.fb.group({
      codigo: ['', Validators.required],
      descuento: [0, [Validators.required, Validators.min(0)]],
      activo: [true]
    });

    this.cargarCodigos();
  }

  cargarCodigos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.codigos = data,
      error: (err) => console.error('Error al cargar códigos', err)
    });
  }

  agregarCodigo(): void {
    const datos = this.codigoForm.value;

    if (this.editando && this.codigoEditandoId) {
      this.http.put(`${this.apiUrl}/${this.codigoEditandoId}`, datos).subscribe({
        next: () => {
          this.codigoForm.reset({ activo: true });
          this.editando = false;
          this.codigoEditandoId = null;
          this.cargarCodigos();
        },
        error: (err) => console.error('Error al editar código', err)
      });
    } else {
      this.http.post(this.apiUrl, datos).subscribe({
        next: () => {
          this.codigoForm.reset({ activo: true });
          this.cargarCodigos();
        },
        error: (err) => console.error('Error al agregar código', err)
      });
    }
  }

  editarCodigo(codigo: any): void {
    this.codigoForm.patchValue({
      codigo: codigo.codigo,
      descuento: codigo.descuento,
      activo: codigo.activo
    });
    this.editando = true;
    this.codigoEditandoId = codigo._id; // 👈 Aquí corregido
  }

  eliminarCodigo(id: string): void {
    if (confirm('¿Estás seguro de eliminar este código?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.cargarCodigos(),
        error: (err) => console.error('Error al eliminar código', err)
      });
    }
  }

  toggleEstado(codigo: any): void {
    const actualizado = { ...codigo, activo: !codigo.activo };
    this.http.put(`${this.apiUrl}/${codigo._id}`, actualizado).subscribe({
      next: () => this.cargarCodigos(),
      error: (err) => console.error('Error al cambiar estado', err)
    });
  }
}
