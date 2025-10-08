import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosRoutingModule } from './servicios-routing.module';
import { VisasComponent } from './visas/visas.component';
import { ViajesComponent } from './viajes/viajes.component';
import { AgenciaComponent } from './agencia/agencia.component';
import { EtaCanadaComponent } from './eta-canada/eta-canada.component';
import { FormvisaComponent } from './formvisa/formvisa.component';
import { PasapportComponent } from '../pasapport/pasapport.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EtaBritanicaComponent } from './eta-britanica/eta-britanica.component';
import { PasaporteamericanoComponent } from './pasaporteamericano/pasaporteamericano.component';
import { FormsModule } from '@angular/forms';        // 👈 agrega esto

@NgModule({
  declarations: [
    VisasComponent,
    ViajesComponent,
    AgenciaComponent,
    EtaCanadaComponent,
    FormvisaComponent,
    EtaBritanicaComponent,
    PasaporteamericanoComponent,
  ],
  imports: [
     CommonModule,
    ServiciosRoutingModule,
    FormsModule,               // 👈 necesario para [(ngModel)]
    ReactiveFormsModule
  ]
})
export class ServiciosModule {}