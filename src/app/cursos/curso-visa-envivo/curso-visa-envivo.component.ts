import { Component } from '@angular/core';

@Component({
  selector: 'app-curso-visa-envivo',
  templateUrl: './curso-visa-envivo.component.html',
  styleUrls: ['./curso-visa-envivo.component.scss']
})
export class CursoVisaEnvivoComponent {
proximaFechaEnVivo: string = '20 de Junio, 2026';
fechaSabado1: string = 'Sábado 20 de Junio';
fechaSabado2: string = 'Sábado 27 de Junio';
horario: string = '2:00 PM a 6:00 PM';
precioTotal: number = 3500;
anticipo: number = 1500;
}
