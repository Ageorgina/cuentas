import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  titulo = 'Cliente';
  cliente = {};
  cteForm: FormGroup;
               // tslint:disable-next-line: variable-name
  constructor( private _cte: ClientesService,
               private formBuilder: FormBuilder) {

     }

  ngOnInit() {

    this.cteForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      empresa: ['', Validators.required],
      puesto: ['', Validators.required],
      celular: ['']
  });


  }

  onSubmit() {
    this.cliente = this.cteForm.value;
    this._cte.cudCtes().add(this.cliente);
  }

}
