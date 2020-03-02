import { Component, OnInit } from '@angular/core';
import { GastosService } from '../../../services/gastos.service';
import { Oficina } from '../../../general/model/oficina';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';

@Component({
  selector: 'app-inv-oficina',
  templateUrl: './inv-oficina.component.html',
  styleUrls: ['./inv-oficina.component.css']
})
export class InvOficinaComponent implements OnInit {
  titulo = 'Oficina';
  headTitle = ['Responsable ASG', 'Fecha', 'Tipo', 'Monto', 'Motivo', 'Modificar / Eliminar'];
  elements: Oficina[] = [];
  saldoDisp = 0;
  ingresos: any;
  egresos: any;
  ingresoT = 0;
  egresoT  = 0;
  // tslint:disable-next-line: variable-name
  constructor( private _gtsOfS: GastosService,
               private  router: Router,
               private alert: AlertasService) {
               }

  ngOnInit() {
    this._gtsOfS.cargarGastosOF().subscribe( (ofi: Oficina[] ) => {
      this.elements = ofi;
      this.elements.filter( data => {
        if ( data.tipo === 'Ingreso') {
          // tslint:disable-next-line: forin
          for (const item in this.elements) {
            this.ingresoT +=  Number(this.elements[item].cantidad);
          }
        } else {
          // tslint:disable-next-line: forin
          for (const item in this.elements) {

            this.egresoT +=  Number(this.elements[item].cantidad);
          }
      }
        this.saldoDisp = this.ingresoT - this.egresoT;
    });
    });

  }
  borrar( value ) {
    this._gtsOfS.cudGastosOF().doc(value.id_of).delete();
    this.alert.showSuccess();
  }

  actualizar(value) {
    this.router.navigate(['registro-oficina', `${value.id_of}`]);
  }

}
