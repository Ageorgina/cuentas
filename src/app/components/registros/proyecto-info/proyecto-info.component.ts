import { Component } from '@angular/core';
import { ProyectosService, NominaService, GastosService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { Proyecto, Gasto, Nomina, Reembolso } from '../../../general/model';

@Component({
  selector: 'app-proyecto-info',
  templateUrl: './proyecto-info.component.html',
  styleUrls: ['./proyecto-info.component.css']
})
export class ProyectoInfoComponent {
  // tslint:disable-next-line: variable-name
  id_proyecto: string;
  updateP: Proyecto;
  loading = true;
  gastos: Gasto[] = [];
  nominas: Nomina[] = [];
  reembolsos: Reembolso[] = [];
  gastosTitle = ['Fecha', 'Monto', 'Motivo', 'Estatus'];
  nominaTitle = ['Nombre', 'Fecha Inicio', 'Fecha Fin', 'Costo', 'Modificar'];
  reembolsoTitle = ['Fecha', 'Monto', 'Motivo', 'Estatus'];
               // tslint:disable-next-line: variable-name
  constructor( private _proyectoS: ProyectosService, private gastoS: GastosService, private nominaS: NominaService,
               private active: ActivatedRoute, private router: Router ) {
    this.id_proyecto = this.active.snapshot.paramMap.get('id_proyecto');
    this._proyectoS.cudProyectos().doc(this.id_proyecto).valueChanges().subscribe((upP: Proyecto) => {
      this.updateP = upP;
      this.loading = false;
    });
    this.gastoS.cargarGastos().subscribe((gastos: Gasto[]) => {
      gastos.filter(gasto => {
        if (gasto.proyecto === this.updateP.nombre) {
          this.gastos.push(gasto);
        } else {
          return ;
        }
      });
    });
    this.gastoS.cargarReembolsos().subscribe((reembolsos: Reembolso[]) => {
      reembolsos.filter(reembolso => {
        if (reembolso.proyecto === this.updateP.nombre) {
          this.reembolsos.push(reembolso);
        } else {
          return ;
        }
      });
    });
    this.nominaS.cargarNomina().subscribe((nominas: Nomina[]) => {
      nominas.filter(nomina => {
        if (nomina.proyecto === this.updateP.nombre) {
          console.log('nominas', nomina)
          this.nominas.push(nomina);
        } else {
          return ;
        } }); });
      }

      actualizar(value) {     this.router.navigate(['registro-nomina', `${value.id_nomina}`]); }

}
