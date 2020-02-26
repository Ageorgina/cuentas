import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-inv-clientes',
  templateUrl: './inv-clientes.component.html',
  styleUrls: ['./inv-clientes.component.css']
})
export class InvClientesComponent implements OnInit {
  titulo = 'Clientes';
  headTitle = ['Nombre', 'Puesto', 'Empresa', 'Celular', 'Modificar / Eliminar'];
  elements = [];
  // tslint:disable-next-line: variable-name
  constructor( private _cteS: ClientesService) { }

  ngOnInit() {
    this._cteS.cargarClientes().subscribe( clientes => {
      this.elements = clientes;
    });
  }

  borrar() {
    console.log('se elimino',  this._cteS.cudCtes());

    // this._cteS.cudCtes().doc(idx).delete();
  }

  actualizar() {
    console.log('se actualizo');
  }

}
