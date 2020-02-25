import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
titulo = 'Cliente';
  constructor( private _cte: ClientesService) {
    
   }

  ngOnInit() {

  }

}
