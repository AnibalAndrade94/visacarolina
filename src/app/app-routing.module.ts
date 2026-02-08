import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { UxuiComponent } from './features/uxui/uxui.component';
import { AvisosComponent } from './features/avisos/avisos.component';
import { ReferidosComponent } from './features/referidos/referidos.component';
import { AdminCodigosComponent } from './features/admin-codigos/admin-codigos.component';
import { VisaEligibilityWizardComponent } from './features/visa-eligibility-wizard/visa-eligibility-wizard.component';
import { VisaAppointmentComponent } from './features/visa-appointment/visa-appointment.component';
import { GuideComponent } from './features/guide/guide.component';


const routes: Routes = [
  // 👇 HOME como raíz absoluta
  { path: '', component: HomeComponent },

  // 👇 Si quieres seguir usando /home por compatibilidad, lo mantenemos
  { path: 'home', component: HomeComponent },

  { path: 'uxui', component: UxuiComponent },
  { path: 'referidos', component: ReferidosComponent },
  { path: 'avisos', component: AvisosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'admincodes', component: AdminCodigosComponent },
{ path: 'evaluacion', component: VisaEligibilityWizardComponent },
  // 👇 Módulo lazy para cursos
  {
    path: 'cursos',
    loadChildren: () =>
      import('./cursos/cursos.module').then(m => m.CursosModule)
  },

  // 👇 Lazy de servicios (ya lo tenías)
  {
    path: 'servicios',
    loadChildren: () =>
      import('./features/servicios/servicios.module').then(m => m.ServiciosModule)
  },
   {
    path: 'info',
    loadChildren: () => import('./info/info.routes').then(m => m.INFO_ROUTES),
  },
    { path: 'recomendaciones-cita-visa', component: VisaAppointmentComponent },

    { path: 'guia', component:  GuideComponent},

  // 👇 404 fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollOffset: [0, 80],
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
