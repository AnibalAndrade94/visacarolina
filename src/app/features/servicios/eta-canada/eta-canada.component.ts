import { Component, OnInit } from '@angular/core';
declare let gtag: Function;


@Component({
  selector: 'app-eta-canada',
  templateUrl: './eta-canada.component.html',
  styleUrls: ['./eta-canada.component.scss']
})
export class EtaCanadaComponent implements OnInit {

ngOnInit(): void {
  gtag('event', 'visita_seccion', {
      event_category: 'Sección',
      event_label: 'eTA Canadiense'
    });
}
}
