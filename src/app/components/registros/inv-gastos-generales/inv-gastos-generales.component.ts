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
  headTitle = ['Fecha', 'Monto', 'Motivo', 'Tipo', 'Proyecto', 'Estatus', 'Comprobantes', 'Modificar / Eliminar'];
  elements: Gasto[] = [];
  loading = true;
  comprobantes: any[] = [];
  // tslint:disable-next-line: variable-name
  constructor( private _gstS: GastosService,
               private router: Router,
               private alert: AlertasService) {
                this._gstS.cargarGastos().subscribe((gastos: Gasto[]) => {
                  this.elements = gastos;
                  this.loading = false;
                  this.elements.filter(registro =>
                    this.comprobantes = registro.comprobantes.split(','));
                });
                }

  ngOnInit() {


  }
  borrar( value ) {
    this.loading = true;
    this._gstS.cudGastos().doc(value.id_gasto).delete();
    this.alert.showSuccess();
    this.loading = false;
  }

  actualizar(value) {
    this.loading = true;
    this.router.navigate(['registro-gastos', `${value.id_gasto}`]);
  }

}
