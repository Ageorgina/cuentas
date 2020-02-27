import { Component, OnInit } from '@angular/core';
import { GastosService } from '../../../services/gastos.service';
import { Oficina } from '../../../general/model/oficina';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inv-oficina',
  templateUrl: './inv-oficina.component.html',
  styleUrls: ['./inv-oficina.component.css']
})
export class InvOficinaComponent implements OnInit {
  titulo = 'Oficina';
  headTitle = ['Responsable ASG', 'Fecha', 'Tipo', 'Cantidad', 'Motivo', 'Modificar / Eliminar'];
  elements: Oficina[] = [];
  // tslint:disable-next-line: variable-name
  constructor( private _gtsOfS: GastosService, private  router: Router) { }

  ngOnInit() {
    this._gtsOfS.cargarGastosOF().subscribe( (ofi: Oficina[] ) => {
      this.elements = ofi;
    });
  }
  borrar( value ) {
    this._gtsOfS.cudGastosOF().doc(value.id_of).delete();
  }

  actualizar(value) {
    this.router.navigate(['registro-oficina', `${value.id_of}`]);
  }

}
