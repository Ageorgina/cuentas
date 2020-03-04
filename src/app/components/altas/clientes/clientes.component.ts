import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Cliente } from '../../../general/model/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/srv_shared/alertas.service';
import { Utils } from '../../../general/utils/utils';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  titulo = 'Registrar Cliente';
  cliente: Cliente;
  boton = 'Guardar';
  cteForm: FormGroup;
  // tslint:disable-next-line: variable-name
  id_cte: string;
  updateCte: Cliente;
  textError: string;
  submitted = false;
  loading = true;
  actualizar = false;

               // tslint:disable-next-line: variable-name
  constructor( private _cteS: ClientesService,
               private formBuilder: FormBuilder,
               private active: ActivatedRoute,
               private router: Router,
               public alert: AlertasService,
               public utils: Utils
               ) {
                this.cteForm = this.formBuilder.group({
                  nombre: ['', Validators.required],
                  empresa: ['', Validators.required],
                  puesto: ['', Validators.required],
                  celular: ['']
              });

                this.id_cte = this.active.snapshot.paramMap.get('id_cte');
                if (this.id_cte) {
                  this.loading = false;
                  this.actualizar = true;
                  this._cteS.cudCtes().doc(this.id_cte).valueChanges().subscribe((upCte: Cliente) => {
                    this.updateCte = upCte;
                    this.cteForm.get(['nombre']).setValue(this.updateCte.nombre);
                    this.cteForm.get(['puesto']).setValue(this.updateCte.puesto);
                    this.cteForm.get(['empresa']).setValue(this.updateCte.empresa);
                    this.cteForm.get(['celular']).setValue(this.updateCte.celular);
                  });
                  }
      }

  ngOnInit() {
    this.loading = false;
  }

  get fval() {

        return this.cteForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    if (!this.id_cte && this.cteForm.invalid) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
    }
    if (!this.cteForm.valid) {

      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
    }

    if (!this.id_cte && this.cteForm.valid) {
      this.submitted = false;
      this.cliente = this.cteForm.value;
      this._cteS.cudCtes().add(this.cliente);
      this.alert.showSuccess();
      this.limpiar();
      this.loading = false;
    }

    if (this.id_cte && this.cteForm.valid) {
      this.submitted = false;
      this.cliente = this.cteForm.value;
      this._cteS.cudCtes().doc(this.id_cte).update(this.cliente);
      this.router.navigate(['clientes']);
      this.alert.showSuccess();
      this.loading = false;
      }
    }

limpiar() {
  // tslint:disable-next-line: no-unused-expression
  this.submitted;
  this.cteForm.get(['nombre']).setValue('');
  this.cteForm.get(['puesto']).setValue('');
  this.cteForm.get(['empresa']).setValue('');
  this.cteForm.get(['celular']).setValue('');
  this.loading = false;
}

checkLetras($event: KeyboardEvent) {
  this.utils.letras($event);
}

checkNumeros($event: KeyboardEvent) {
  this.utils.numeros($event);
}
regresar() {
  this.router.navigate(['clientes']);
}
}
