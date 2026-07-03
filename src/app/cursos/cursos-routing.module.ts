import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingCursosComponent } from './landing-cursos/landing-cursos.component';
import { CusoListComponent } from './cuso-list/cuso-list.component';
import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component';
import { CursoPlayerComponent } from './curso-player/curso-player.component';
import { DashboardAlumnoComponent } from './dashboard-alumno/dashboard-alumno.component';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { ConfirmarCorreoComponent } from './confirmar-correo/confirmar-correo.component';
import { AuthGuard } from '../guard/auth.guard';
import { Landing2Component } from './landing2/landing2.component';
import { CursoVisaEnvivoComponent } from './curso-visa-envivo/curso-visa-envivo.component';

const routes: Routes = [
  {
    path: '',
    component: LandingCursosComponent,
  },
  {
    path: 'lista',
    component: CusoListComponent,
  },
  {
    path: 'landing',
    component: Landing2Component,
  },
  {
    path: 'confirmar-correo',
    component: ConfirmarCorreoComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegisterComponent
  },
  {
    path: 'curso-envivo',
    component: CursoVisaEnvivoComponent
  },
  {
    path: 'mis-cursos',
    component: DashboardAlumnoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':slug',
    component: CursoDetalleComponent,
  },
  {
    path: ':slug/ver',
    component: CursoPlayerComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursosRoutingModule {}