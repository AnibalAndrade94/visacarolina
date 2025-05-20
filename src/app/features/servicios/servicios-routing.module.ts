import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisasComponent } from './visas/visas.component';
import { ViajesComponent } from './viajes/viajes.component';
import { AgenciaComponent } from './agencia/agencia.component';
import { FormvisaComponent } from './formvisa/formvisa.component';
import { EtaCanadaComponent } from './eta-canada/eta-canada.component';
import { EtaBritanicaComponent } from './eta-britanica/eta-britanica.component';
import { PasapportComponent } from '../pasapport/pasapport.component';
const routes: Routes = [
  { path: 'visas', component: VisasComponent },
  { path: 'formvisa', component: FormvisaComponent },
  { path: 'ten-tu-agencia', component: AgenciaComponent },
  { path: 'pasapport',component:PasapportComponent },
  { path: 'etacanada',component:EtaCanadaComponent },

  {path:'etabritanica', component: EtaBritanicaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosRoutingModule {}