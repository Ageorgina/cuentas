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


const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // ALTAS
  { path: 'registro-usuarios', component: UsuariosComponent },
  { path: 'registro-clientes', component: ClientesComponent },
  { path: 'registro-proyectos', component: ProyectosComponent},
  { path: 'registro-gastos', component: GastosGeneralesComponent },
  { path: 'registro-oficina', component: RegistroOficinaComponent },
  { path: 'registro-reembolso', component: ReembolsoComponent},

  // INVENTARIOS
  { path: 'usuarios', component: InvUsuariosComponent },
  { path: 'clientes', component: InvClientesComponent },
  { path: 'proyectos', component: InvProyectosComponent},
  { path: 'gastos', component: InvGastosGeneralesComponent },
  { path: 'oficina', component: InvOficinaComponent},
  { path: 'reembolsos', component: InvReembolsoComponent},


  // UPDATE
  { path: 'registro-usuarios/:id_user', component: UsuariosComponent },
  { path: 'registro-clientes/:id_cte', component: ClientesComponent },
  { path: 'registro-proyectos/:id_proyecto', component: ProyectosComponent},
  { path: 'registro-gastos/:id_gasto', component: GastosGeneralesComponent },
  { path: 'registro-oficina/:id_of', component: RegistroOficinaComponent },
  { path: 'registro-reembolsos/:id_reembolso', component: InvReembolsoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
