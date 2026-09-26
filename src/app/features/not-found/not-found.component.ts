import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  template: `
    <section class="container text-center py-5">
      <h1 class="display-5 mb-3">Página no encontrada</h1>
      <p class="lead mb-4">La página que buscas no existe o cambió de dirección.</p>
      <a routerLink="/" class="btn btn-primary">Volver al inicio</a>
    </section>
  `
})
export class NotFoundComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Página no encontrada | VisaCarolina',
      description: 'La página que buscas no existe o cambió de dirección.',
      path: '/404',
      noindex: true
    });
  }
}