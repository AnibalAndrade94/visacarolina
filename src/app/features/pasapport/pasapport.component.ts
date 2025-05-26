import { Component, OnInit } from '@angular/core';
declare let gtag: Function;
@Component({
  selector: 'app-pasapport',
  templateUrl: './pasapport.component.html',
  styleUrls: ['./pasapport.component.scss']
})
export class PasapportComponent implements OnInit {

ngOnInit(): void {
  gtag('event', 'visita_seccion', {
      event_category: 'Sección',
      event_label: 'pasaporte'
    });
}
}
