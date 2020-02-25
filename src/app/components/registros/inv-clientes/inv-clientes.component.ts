import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';
import { Cliente } from '../../../general/model/cliente';

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
    }
      );
  }

}
