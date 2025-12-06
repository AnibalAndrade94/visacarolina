import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../curso.service';

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle.component.html',
  styleUrls: ['./curso-detalle.component.scss']
})
export class CursoDetalleComponent implements OnInit {
curso: any = null;

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

    // Si no existe el curso, regresamos a la lista
    if (!this.curso) {
      this.router.navigate(['/cursos/lista']);
    }
  }

  // MVP: aquí en el futuro irá la lógica de compra (Stripe / backend)
  onComprar(): void {
    console.log('Comprar curso:', this.curso?.slug);
    // aquí luego rediriges a checkout
  }
}
