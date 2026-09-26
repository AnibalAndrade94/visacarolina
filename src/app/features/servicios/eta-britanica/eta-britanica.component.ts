import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

declare let gtag: Function;
@Component({
  selector: 'app-eta-britanica',
  templateUrl: './eta-britanica.component.html',
  styleUrls: ['./eta-britanica.component.scss']
})
export class EtaBritanicaComponent implements OnInit {
 constructor(private seo: SeoService) {}
ngOnInit(): void {
     this.seo.update({ title: 'ETA del Reino Unido: trámite paso a paso | VisaCarolina',
  description: 'Asesoría para tu ETA del Reino Unido: requisitos, llenado y seguimiento hasta la aprobación.',
  path: '/servicios/etabritanica' });
  gtag('event', 'visita_seccion', {
      event_category: 'Sección',
      event_label: 'eTA Britanica'
    });
}
}