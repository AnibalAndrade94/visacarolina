import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // 👈 Importar esto

// Componentes principales
import { HomeComponent } from './features/home/home.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { UxuiComponent } from './features/uxui/uxui.component';
import { ReactiveFormsModule } from '@angular/forms'; // 👈 Importa esto
import { HttpClientModule } from '@angular/common/http';
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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }