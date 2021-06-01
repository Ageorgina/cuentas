import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent, ClientesComponent, ProyectosComponent, GastosGeneralesComponent,
         NominaComponent, ReembolsoComponent, RegistroOficinaComponent} from '../app/components/altas';
import { InvUsuariosComponent, InvClientesComponent, ProyectoInfoComponent, InvGastosGeneralesComponent,
         InvReembolsoComponent, InvProyectosComponent, InvOficinaComponent } from '../app/components/registros';
import { AuthGuard } from './security';
import { LoginComponent } from './login/login.component';
import { CuentasComponent } from './components/altas/cuentas/cuentas.component';

 const routes: Routes = [

   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'login', component: LoginComponent},
   // ALTAS
   { path: 'registro-cuentas', component: CuentasComponent, canActivate: [AuthGuard]},
   { path: 'registro-usuarios', component: UsuariosComponent, canActivate: [AuthGuard]},
   { path: 'registro-clientes', component: ClientesComponent, canActivate: [AuthGuard]},
   { path: 'registro-proyectos', component: ProyectosComponent, canActivate: [AuthGuard]},
   { path: 'registro-gastos', component: GastosGeneralesComponent, canActivate: [AuthGuard]},
   { path: 'registro-oficina', component: RegistroOficinaComponent, canActivate: [AuthGuard]},
   { path: 'registro-reembolso', component: ReembolsoComponent, canActivate: [AuthGuard]},
   { path: 'registro-nomina', component: NominaComponent, canActivate: [AuthGuard]},

   // INVENTARIOS
   { path: 'usuarios', component: InvUsuariosComponent, canActivate: [AuthGuard]},
   { path: 'clientes', component: InvClientesComponent, canActivate: [AuthGuard]},
   { path: 'proyectos', component: InvProyectosComponent, canActivate: [AuthGuard]},
   { path: 'gastos', component: InvGastosGeneralesComponent, canActivate: [AuthGuard]},
   { path: 'oficina', component: InvOficinaComponent, canActivate: [AuthGuard]},
   { path: 'reembolsos', component: InvReembolsoComponent, canActivate: [AuthGuard]},

   // UPDATE
   { path: 'registro-usuarios/:id_user', component: UsuariosComponent, canActivate: [AuthGuard]},
   { path: 'registro-clientes/:id_cte', component: ClientesComponent, canActivate: [AuthGuard]},
   { path: 'registro-proyectos/:id_proyecto', component: ProyectosComponent, canActivate: [AuthGuard]},
   { path: 'registro-gastos/:id_gasto', component: GastosGeneralesComponent, canActivate: [AuthGuard]},
   { path: 'registro-oficina/:id_of', component: RegistroOficinaComponent, canActivate: [AuthGuard]},
   { path: 'registro-reembolso/:id_reembolso', component: ReembolsoComponent, canActivate: [AuthGuard]},
   { path: 'registro-nomina/:id_nomina', component: NominaComponent, canActivate: [AuthGuard]},
   { path: 'descripcion-proyecto/:id_proyecto', component: ProyectoInfoComponent, canActivate: [AuthGuard]}
 ];


@NgModule({
  imports: [RouterModule.forRoot(routes,  {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
