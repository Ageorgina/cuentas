import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';
import { Cliente } from '../../../general/model/cliente';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/srv_shared/alertas.service';

@Component({
  selector: 'app-inv-clientes',
  templateUrl: './inv-clientes.component.html',
  styleUrls: ['./inv-clientes.component.css']
})
export class InvClientesComponent implements OnInit {
  titulo = 'Clientes';
  headTitle = ['Nombre', 'Puesto', 'Empresa', 'Celular', 'Modificar / Eliminar'];
  elements: Cliente[] = [];
  // tslint:disable-next-line: variable-name
  constructor( private _cteS: ClientesService, 
                private router: Router,
                private alert: AlertasService) { }

  ngOnInit() {
    this._cteS.cargarClientes().subscribe( (clientes: Cliente[]) => {
      this.elements = clientes;
    });
  }
  borrar( value ) {
    this._cteS.cudCtes().doc(value.id_cte).delete();
    this.alert.showSuccess();
  }

  actualizar(value) {
    this.router.navigate(['registro-clientes', `${value.id_cte}`]);
  }

}
