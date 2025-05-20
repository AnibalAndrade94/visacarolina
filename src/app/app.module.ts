import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Componentes principales
import { HomeComponent } from './features/home/home.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { UxuiComponent } from './features/uxui/uxui.component';
import { ReactiveFormsModule } from '@angular/forms'; // 👈 Importa esto
import { HttpClientModule } from '@angular/common/http';
import { PasapportComponent } from './features/pasapport/pasapport.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactoComponent,
    NavbarComponent,
    FooterComponent,
    UxuiComponent,
    PasapportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }