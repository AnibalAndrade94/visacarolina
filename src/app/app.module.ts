import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // 👈 Importar esto
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
// Componentes principales
import { HomeComponent } from './features/home/home.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { UxuiComponent } from './features/uxui/uxui.component';
import { ReactiveFormsModule } from '@angular/forms'; // 👈 Importa esto
import { PasapportComponent } from './features/pasapport/pasapport.component';
import { AvisosComponent } from './features/avisos/avisos.component';
import { ReferidosComponent } from './features/referidos/referidos.component';
import { FormularioComponent } from './formulario/formulario.component';
import { Formulario2Component } from './features/formulario2/formulario2.component';
import { AdminCodigosComponent } from './features/admin-codigos/admin-codigos.component';
import { LandingCursosComponent } from './cursos/landing-cursos/landing-cursos.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EmbassyMapComponent } from './core/embassy-map/embassy-map.component';
import { InfoLayoutComponent } from './info/info-layout/info-layout.component';
import { ConsuladosComponent } from './info/pages/consulados/consulados.component';
import { CostosComponent } from './info/pages/costos/costos.component';
import { PasaporteComponent } from './info/pages/pasaporte/pasaporte.component';
import { MapaPasaporteComponent } from './info/pages/mapa-pasaporte/mapa-pasaporte.component';
import { FaqComponent } from './info/pages/faq/faq.component';
import { VisaEligibilityWizardComponent } from './features/visa-eligibility-wizard/visa-eligibility-wizard.component';
import { VisaAppointmentComponent } from './features/visa-appointment/visa-appointment.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { GuideComponent } from './features/guide/guide.component';
import { NotFoundComponent } from './features/not-found/not-found.component'; // <-- ajusta ruta

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactoComponent,
    NavbarComponent,
    FooterComponent,
    UxuiComponent,
    PasapportComponent,
    AvisosComponent,
    ReferidosComponent,
    FormularioComponent,
    Formulario2Component,
    AdminCodigosComponent,
    LoginComponent,
    RegisterComponent,
    EmbassyMapComponent,
    InfoLayoutComponent,
    ConsuladosComponent,
    CostosComponent,
    PasaporteComponent,
    MapaPasaporteComponent,
    FaqComponent,
    VisaEligibilityWizardComponent,
    VisaAppointmentComponent,
    GuideComponent,
    NotFoundComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    initializeApp(environment.firebase);
  }
 }