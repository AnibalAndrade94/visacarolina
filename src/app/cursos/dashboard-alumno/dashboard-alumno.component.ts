import { Component, OnInit } from '@angular/core';
import { CursoService } from '../curso.service';
@Component({
  selector: 'app-dashboard-alumno',
  templateUrl: './dashboard-alumno.component.html',
  styleUrls: ['./dashboard-alumno.component.scss']
})
export class DashboardAlumnoComponent implements OnInit{
cursosComprados: any[] = [];

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.cursosComprados = this.cursoService.getCursosComprados();
  }
}
