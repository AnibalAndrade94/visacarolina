import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-referidos',
  templateUrl: './referidos.component.html',
  styleUrls: ['./referidos.component.scss']
})
export class ReferidosComponent {
  codigo: string = '';
  errorCodigo: string = '';
  referidoValido: boolean = false;
  tipoTramite: string = '';
  cantidadPersonas: number = 1;
  formularios: number[] = [];
  descuento: number = 0;

  constructor(private http: HttpClient) {}

  verificarCodigo(): void {
    this.errorCodigo = '';
    this.referidoValido = false;

    if (!this.codigo) {
      this.errorCodigo = 'Por favor, ingresa un código.';
      return;
    }

    this.http.get<any>(`https://visaback-production.up.railway.app/codigos/${this.codigo}`)
      .subscribe({
        next: (res) => {
          if (res && res.codigo) {
            this.referidoValido = true;
            this.descuento = res.descuento;
          } else {
            this.errorCodigo = 'Código inválido o no encontrado.';
          }
        },
        error: () => {
          this.errorCodigo = 'Error al verificar el código. Intenta más tarde.';
        }
      });
  }

  mostrarFormulario(): void {
    this.formularios = [];
    if (this.cantidadPersonas >= 1) {
      this.generarFormularios();
    }
  }

  generarFormularios(): void {
    this.formularios = Array(this.cantidadPersonas).fill(0);
  }
}
