import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

declare let gtag: Function;
@Component({
  selector: 'app-visas',
  templateUrl: './visas.component.html',
  styleUrls: ['./visas.component.scss']
})
export class VisasComponent implements OnInit {
  constructor(private seo: SeoService) {}

ngOnInit(): void {
  this.seo.update({ title: 'Trámite de Visa Americana en México | VisaCarolina',
  description: 'Te acompañamos en todo el proceso de tu visa americana: DS-160, cita y preparación para la entrevista.',
  path: '/servicios/visas' });
  gtag('event', 'visita_seccion', {
      event_category: 'Sección',
      event_label: 'visa americana'
    });
}
}
