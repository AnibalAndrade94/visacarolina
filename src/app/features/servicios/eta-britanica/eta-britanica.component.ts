import { Component, OnInit } from '@angular/core';
declare let gtag: Function;
@Component({
  selector: 'app-eta-britanica',
  templateUrl: './eta-britanica.component.html',
  styleUrls: ['./eta-britanica.component.scss']
})
export class EtaBritanicaComponent implements OnInit {

ngOnInit(): void {
  gtag('event', 'visita_seccion', {
      event_category: 'Sección',
      event_label: 'eTA Britanica'
    });
}
}