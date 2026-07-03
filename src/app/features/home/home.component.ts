import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CursoService } from '../../cursos/curso.service';
import { Course } from '../../cursos/models/cursos.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  proximaFechaEnVivo: string = '18 de julio, 2026'
  cursos: Course[] = [];

  constructor(private title: Title, private meta: Meta, private cursoService: CursoService) {}

  ngOnInit(): void {
    this.title.setTitle('Visa americana y canadiense en México | VisaCarolina');
    this.meta.updateTag({
      name: 'description',
      content: 'Te ayudamos con visa americana, visa canadiense, eTA y pasaporte. Acompañamiento paso a paso desde cualquier ciudad de México.'
    });
    this.cursos = this.cursoService.getCursos();
  }

  getCursoLink(slug: string): string {
    if (slug === 'visa-americana') return '/cursos/landing';
    return `/cursos/${slug}`;
  }
}