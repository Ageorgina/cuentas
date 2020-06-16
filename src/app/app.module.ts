import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { UsuariosComponent } from './components/altas/usuarios/usuarios.component';
import { ClientesComponent } from './components/altas/clientes/clientes.component';
import { ProyectosComponent } from './components/altas/proyectos/proyectos.component';
import { GastosGeneralesComponent } from './components/altas/gastos-generales/gastos-generales.component';
import { NominaComponent } from './components/altas/nomina/nomina.component';
import { InvGastosGeneralesComponent } from './components/registros/inv-gastos-generales/inv-gastos-generales.component';
import { InvUsuariosComponent } from './components/registros/inv-usuarios/inv-usuarios.component';
import { InvProyectosComponent } from './components/registros/inv-proyectos/inv-proyectos.component';
import { InvClientesComponent } from './components/registros/inv-clientes/inv-clientes.component';
import { InvOficinaComponent } from './components/registros/inv-oficina/inv-oficina.component';
import { InvNominaComponent } from './components/registros/inv-nomina/inv-nomina.component';

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
import { AngularFireStorageModule } from '@angular/fire/storage';


import { environment } from '../environments/environment';
import { NgDropFilesDirective } from './directives/ng-drop-files.directive';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './security/logout/logout.component';
import { ReembolsoComponent } from './components/altas/reembolso/reembolso.component';
import { InvReembolsoComponent } from './components/registros/inv-reembolso/inv-reembolso.component';

// http
import { HttpClientModule} from '@angular/common/http';

// ngrx
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { ProyectoInfoComponent } from './components/registros/proyecto-info/proyecto-info.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UsuariosComponent,
    ClientesComponent,
    ProyectosComponent,
    GastosGeneralesComponent,
    InvGastosGeneralesComponent,
    InvUsuariosComponent,
    InvProyectosComponent,
    InvClientesComponent,
    RegistroOficinaComponent,
    InvOficinaComponent,
    NgDropFilesDirective,
    LoginComponent,
    LogoutComponent,
    ReembolsoComponent,
    InvReembolsoComponent,
    NominaComponent,
    InvNominaComponent,
    ProyectoInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule
  ],
  providers: [ ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
