import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { UxuiComponent } from './features/uxui/uxui.component';
import { AvisosComponent } from './features/avisos/avisos.component';
import { ReferidosComponent } from './features/referidos/referidos.component';
import { AdminCodigosComponent } from './features/admin-codigos/admin-codigos.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'uxui', component: UxuiComponent },
  { path: 'referidos', component: ReferidosComponent },
  { path: 'avisos', component: AvisosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'admincodes', component: AdminCodigosComponent },
  { path: '**', redirectTo: 'home' }, // Ruta comodín (404)
  // Lazy load para el módulo de servicios
  {
    path: 'servicios',
    loadChildren: () =>
      import('./features/servicios/servicios.module').then(m => m.ServiciosModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}