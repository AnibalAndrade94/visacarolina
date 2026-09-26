import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

declare let gtag: Function;


@Component({
  selector: 'app-eta-canada',
  templateUrl: './eta-canada.component.html',
  styleUrls: ['./eta-canada.component.scss']
})
export class EtaCanadaComponent implements OnInit {
  constructor(private seo: SeoService) {}

ngOnInit(): void {
     this.seo.update({ title: 'eTA de Canadá: trámite y asesoría | VisaCarolina',
  description: 'Solicita tu autorización electrónica de viaje (eTA) para Canadá con acompañamiento y revisión de datos.',
  path: '/servicios/etacanada' });
  gtag('event', 'visita_seccion', {
      event_category: 'Sección',
      event_label: 'eTA Canadiense'
    });
}
}
