import { Component, OnInit } from '@angular/core';
import { GastosService } from '../../../services/gastos.service';
import { Gasto } from '../../../general/model/gasto';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';

@Component({
  selector: 'app-inv-gastos-generales',
  templateUrl: './inv-gastos-generales.component.html',
  styleUrls: ['./inv-gastos-generales.component.css']
})
export class InvGastosGeneralesComponent implements OnInit {
  titulo = 'Gastos Generales';
  headTitle = ['Responsable ASG', 'Fecha', 'Monto', 'Motivo', 'Tipo', 'Proyecto', 'Estatus', 'Modificar / Eliminar'];
  elements: Gasto[] = [];
  // tslint:disable-next-line: variable-name
  constructor( private _gstS: GastosService,
               private router: Router,
               private alert: AlertasService) { }

  ngOnInit() {
    this._gstS.cargarGastos().subscribe((gastos: Gasto[]) => {
        this.elements = gastos;
      });
  }
  borrar( value ) {
    this._gstS.cudGastos().doc(value.id_gasto).delete();
    this.alert.showSuccess();
  }

  actualizar(value) {
    this.router.navigate(['registro-gastos', `${value.id_gasto}`]);
  }

}
