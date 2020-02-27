import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UsuariosComponent } from './components/altas/usuarios/usuarios.component';
import { ClientesComponent } from './components/altas/clientes/clientes.component';
import { ProyectosComponent } from './components/altas/proyectos/proyectos.component';
import { GastosGeneralesComponent } from './components/altas/gastos-generales/gastos-generales.component';
import { TablasComponent } from './shared/tablas/tablas.component';
import { InvGastosGeneralesComponent } from './components/registros/inv-gastos-generales/inv-gastos-generales.component';
import { InvUsuariosComponent } from './components/registros/inv-usuarios/inv-usuarios.component';
import { InvProyectosComponent } from './components/registros/inv-proyectos/inv-proyectos.component';
import { InvClientesComponent } from './components/registros/inv-clientes/inv-clientes.component';
import { InvOficinaComponent } from './components/registros/inv-oficina/inv-oficina.component';

// Formularios
import { ReactiveFormsModule } from '@angular/forms';

// MDBootstrap
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RegistroOficinaComponent } from './components/altas/registro-oficina/registro-oficina.component';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    UsuariosComponent,
    ClientesComponent,
    ProyectosComponent,
    GastosGeneralesComponent,
    TablasComponent,
    InvGastosGeneralesComponent,
    InvUsuariosComponent,
    InvProyectosComponent,
    InvClientesComponent,
    RegistroOficinaComponent,
    InvOficinaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule
  ],
  providers: [ ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
