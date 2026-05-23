import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../curso.service';
import { Course } from '../models/cursos.model';

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle.component.html',
  styleUrls: ['./curso-detalle.component.scss']
})
export class CursoDetalleComponent implements OnInit {
  curso: Course | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.curso = this.cursoService.getCurso(slug);
    }

    if (!this.curso) {
      this.router.navigate(['/cursos/lista']);
    }
  }

  onComprar(): void {
    console.log('Comprar curso:', this.curso?.slug);
  }
}