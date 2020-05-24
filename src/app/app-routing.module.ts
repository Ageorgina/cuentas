import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './components/altas/usuarios/usuarios.component';
import { ClientesComponent } from './components/altas/clientes/clientes.component';
import { ProyectosComponent } from './components/altas/proyectos/proyectos.component';
import { GastosGeneralesComponent } from './components/altas/gastos-generales/gastos-generales.component';
import { InvUsuariosComponent } from './components/registros/inv-usuarios/inv-usuarios.component';
import { InvClientesComponent } from './components/registros/inv-clientes/inv-clientes.component';
import { InvProyectosComponent } from './components/registros/inv-proyectos/inv-proyectos.component';
import { InvGastosGeneralesComponent } from './components/registros/inv-gastos-generales/inv-gastos-generales.component';
import { RegistroOficinaComponent } from './components/altas/registro-oficina/registro-oficina.component';
import { InvOficinaComponent } from './components/registros/inv-oficina/inv-oficina.component';
import { LoginComponent } from './login/login.component';
import { ReembolsoComponent } from './components/altas/reembolso/reembolso.component';
import { InvReembolsoComponent } from './components/registros/inv-reembolso/inv-reembolso.component';
import { AuthGuard } from './security/guards/auth.guard';

const routes: Routes = [
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  // ALTAS
  { path: 'registro-usuarios', component: UsuariosComponent,canActivate: [AuthGuard]},
  { path: 'registro-clientes', component: ClientesComponent,canActivate: [AuthGuard]},
  { path: 'registro-proyectos', component: ProyectosComponent,canActivate: [AuthGuard]},
  { path: 'registro-gastos', component: GastosGeneralesComponent,canActivate: [AuthGuard]},
  { path: 'registro-oficina', component: RegistroOficinaComponent,canActivate: [AuthGuard]},
  { path: 'registro-reembolso', component: ReembolsoComponent,canActivate: [AuthGuard]},

  // INVENTARIOS
  { path: 'usuarios', component: InvUsuariosComponent,canActivate: [AuthGuard]},
  { path: 'clientes', component: InvClientesComponent,canActivate: [AuthGuard]},
  { path: 'proyectos', component: InvProyectosComponent,canActivate: [AuthGuard]},
  { path: 'gastos', component: InvGastosGeneralesComponent,canActivate: [AuthGuard]},
  { path: 'oficina', component: InvOficinaComponent,canActivate: [AuthGuard]},
  { path: 'reembolsos', component: InvReembolsoComponent,canActivate: [AuthGuard]},


  // UPDATE
  { path: 'registro-usuarios/:id_user', component: UsuariosComponent,canActivate: [AuthGuard]},
  { path: 'registro-clientes/:id_cte', component: ClientesComponent,canActivate: [AuthGuard]},
  { path: 'registro-proyectos/:id_proyecto', component: ProyectosComponent,canActivate: [AuthGuard]},
  { path: 'registro-gastos/:id_gasto', component: GastosGeneralesComponent,canActivate: [AuthGuard]},
  { path: 'registro-oficina/:id_of', component: RegistroOficinaComponent,canActivate: [AuthGuard]},
  { path: 'registro-reembolso/:id_reembolso', component: ReembolsoComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
