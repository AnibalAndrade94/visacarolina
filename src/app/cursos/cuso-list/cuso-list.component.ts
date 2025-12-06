import { Component, OnInit } from '@angular/core';
import { CursoService } from '../curso.service';
@Component({
  selector: 'app-cuso-list',
  templateUrl: './cuso-list.component.html',
  styleUrls: ['./cuso-list.component.scss']
})
export class CusoListComponent implements OnInit{
cursos: any[] = [];

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.cursos = this.cursoService.getCursos();
  }
}
