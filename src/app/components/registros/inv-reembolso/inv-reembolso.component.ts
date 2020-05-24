import { Component, OnInit } from '@angular/core';
import { Reembolso } from 'src/app/general/model/reembolso';
import { GastosService } from '../../../services/gastos.service';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { Gasto } from '../../../general/model/gasto';

@Component({
  selector: 'app-inv-reembolso',
  templateUrl: './inv-reembolso.component.html',
  styleUrls: ['./inv-reembolso.component.css']
})
export class InvReembolsoComponent implements OnInit {

  titulo = 'Reembolsos';
  headTitle = ['Solicitante', 'Fecha', 'Monto', 'Motivo', 'Estatus', 'Comprobantes', 'Modificar / Eliminar'];
  elements: Reembolso[] = [];
  loading = true;
  comprobantes: any[] = [];
  // tslint:disable-next-line: variable-name
  constructor( private _gstS: GastosService,
               private router: Router,
               private alert: AlertasService) {
                this._gstS.cargarReembolsos().subscribe((reembolsos: Reembolso[]) => {
                  this.elements = reembolsos;
                  this.loading = false;
                 /* this.elements.filter(registro =>
                    this.comprobantes = registro.comprobantes.split(','));*/
                });
                }

  ngOnInit() {


  }
  borrar( value ) {
    this.loading = true;
    this._gstS.cudReembolsos().doc(value.id_reembolso).delete();
    this.alert.showSuccess();
    this.loading = false;
  }

  actualizar(value) {
    this.loading = true;
    this.router.navigate(['registro-reembolso', `${value.id_reembolso}`]);
  }

}
