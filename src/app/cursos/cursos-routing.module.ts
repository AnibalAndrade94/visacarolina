import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingCursosComponent } from './landing-cursos/landing-cursos.component';
import { CusoListComponent } from './cuso-list/cuso-list.component';
import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component';
import { CursoPlayerComponent } from './curso-player/curso-player.component';
import { DashboardAlumnoComponent } from './dashboard-alumno/dashboard-alumno.component';

const routes: Routes = [
  {
    path: '',
    component: LandingCursosComponent, // /cursos
  },
  {
    path: 'lista',
    component: CusoListComponent, // /cursos/lista
  },
  { path: 'mis-cursos', component: DashboardAlumnoComponent },
  {
    path: ':slug',
    component: CursoDetalleComponent, // /cursos/visa-americana
  },
  {
    path: ':slug/ver',
    component: CursoPlayerComponent, // /cursos/visa-americana/ver
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursosRoutingModule {}
