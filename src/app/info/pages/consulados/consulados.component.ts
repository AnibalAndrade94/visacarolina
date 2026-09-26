import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-consulados',
  templateUrl: './consulados.component.html',
  styleUrls: ['./consulados.component.scss']
})
export class ConsuladosComponent implements OnInit {
 constructor(private seo: SeoService) {}
  ngOnInit(): void {
     this.seo.update({ title: 'Consulados de EE. UU. en México y tiempos de cita | VisaCarolina',
  description: 'Ubicación de consulados estadounidenses en México y tiempos de espera de cita por ciudad.',
  path: '/info/consulados' });

}

}
