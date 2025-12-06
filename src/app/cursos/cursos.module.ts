import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosRoutingModule } from './cursos-routing.module';

// Componentes del módulo
import { LandingCursosComponent } from './landing-cursos/landing-cursos.component';
import { CusoListComponent } from './cuso-list/cuso-list.component';
import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component';
import { CursoPlayerComponent } from './curso-player/curso-player.component';

// Opcional: si vas a usar formularios dentro de cursos
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardAlumnoComponent } from './dashboard-alumno/dashboard-alumno.component';

@NgModule({
  declarations: [
    LandingCursosComponent,
    CusoListComponent,
    CursoDetalleComponent,
    CursoPlayerComponent,
    DashboardAlumnoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CursosRoutingModule
  ]
})
export class CursosModule {}