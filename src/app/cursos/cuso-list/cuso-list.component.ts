import { Component, OnInit } from '@angular/core';
import { CursoService } from '../curso.service';
import { Course } from '../models/cursos.model';

@Component({
  selector: 'app-cuso-list',
  templateUrl: './cuso-list.component.html',
  styleUrls: ['./cuso-list.component.scss']
})
export class CusoListComponent implements OnInit {
  cursos: Course[] = [];

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.cursos = this.cursoService.getCursos();
  }
}