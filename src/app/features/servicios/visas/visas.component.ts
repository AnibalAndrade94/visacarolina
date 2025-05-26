import { Component, OnInit } from '@angular/core';
declare let gtag: Function;
@Component({
  selector: 'app-visas',
  templateUrl: './visas.component.html',
  styleUrls: ['./visas.component.scss']
})
export class VisasComponent implements OnInit {

ngOnInit(): void {
  gtag('event', 'visita_seccion', {
      event_category: 'Sección',
      event_label: 'visa americana'
    });
}
}
