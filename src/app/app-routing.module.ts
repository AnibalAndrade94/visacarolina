import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { UxuiComponent } from './features/uxui/uxui.component';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'uxui', component: UxuiComponent },

  // Lazy load para el módulo de servicios
  {
    path: 'servicios',
    loadChildren: () =>
      import('./features/servicios/servicios.module').then(m => m.ServiciosModule)
  },

  { path: 'contacto', component: ContactoComponent },

  { path: '**', redirectTo: 'home' } // Ruta comodín (404)
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}