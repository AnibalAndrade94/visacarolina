import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CursoService } from '../../cursos/curso.service';
import { Course } from '../../cursos/models/cursos.model';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  proximaFechaEnVivo: string = '18 de julio, 2026'
  cursos: Course[] = [];

  constructor(private seo: SeoService,private title: Title, private meta: Meta, private cursoService: CursoService) {}

 ngOnInit(): void {
    this.seo.update({
      title: 'Visa americana y canadiense en México | VisaCarolina',
      description: 'Asesoría paso a paso para tu visa americana, canadiense, eTA y pasaporte, desde cualquier ciudad de México.',
      path: '/'
    });
    this.cursos = this.cursoService.getCursos();
  }

  getCursoLink(slug: string): string {
    if (slug === 'visa-americana') return '/cursos/landing';
    return `/cursos/${slug}`;
  }
}