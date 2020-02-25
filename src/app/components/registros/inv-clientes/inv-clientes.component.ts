import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';
import { Cliente } from '../../../general/model/cliente';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-inv-clientes',
  templateUrl: './inv-clientes.component.html',
  styleUrls: ['./inv-clientes.component.css']
})
export class InvClientesComponent implements OnInit {
  titulo = 'Clientes'
  headTitle = ['Nombre', 'Puesto', 'Empresa', 'Celular', 'Modificar / Eliminar'];
  elements = [];
  constructor( private _cteS: ClientesService) { }

  ngOnInit() {
    this._cteS.cargarClientes().subscribe( clientes => {
      this.elements = clientes;
    });
  }

  borrar(idx) {
    console.log('se elimino', idx);
    console.log('->', this._cteS.cudCtes().doc());
   // this._cteS.cudCtes().doc(idx).delete();
  }

  actualizar() {
    console.log('se actualizo');
  }

}
