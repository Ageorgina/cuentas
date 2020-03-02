import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GastosService } from '../../../services/gastos.service';
import { Usuario } from '../../../general/model/usuario';
import { Gasto } from '../../../general/model/gasto';
import { Oficina } from '../../../general/model/oficina';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { Utils } from '../../../general/utils/utils';

@Component({
  selector: 'app-registro-oficina',
  templateUrl: './registro-oficina.component.html',
  styleUrls: ['./registro-oficina.component.css']
})
export class RegistroOficinaComponent implements OnInit {
  titulo = 'Registrar Gasto Oficina';
  usuarios: Usuario[] = [];
  gasto: Oficina;
  gastos: Gasto[] = [];
  boton = 'Guardar';
  ofForm: FormGroup;
  // tslint:disable-next-line: variable-name
  id_of: string;
  updateOf: Oficina;
  textError: string;
  submitted = false;

  constructor( private formBuilder: FormBuilder,
               // tslint:disable-next-line: variable-name
               private _user: UsuariosService,
               // tslint:disable-next-line: variable-name
               private _ofS: GastosService,
               private active: ActivatedRoute,
               private router: Router,
               private utils: Utils,
               public alert: AlertasService) {
                 this.ofForm = this.formBuilder.group({
                   resp_asg: ['', Validators.required],
                   fecha: ['', Validators.required],
                   cantidad: ['', Validators.required],
                   motivo: ['', Validators.required],
                   tipo: ['', Validators.required]
                  });
                 this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
                    this.usuarios = usuarios; });

                 this.id_of = this.active.snapshot.paramMap.get('id_of');
                 if (this.id_of) {
                    this.boton = 'Actualizar';
                    this._ofS.cudGastosOF().doc(this.id_of).valueChanges().subscribe((upOf: Oficina) => {
                      this.updateOf = upOf;
                      this.ofForm.get(['resp_asg']).setValue(this.updateOf.resp_asg);
                      this.ofForm.get(['fecha']).setValue(this.updateOf.fecha);
                      this.ofForm.get(['cantidad']).setValue(this.updateOf.cantidad);
                      this.ofForm.get(['motivo']).setValue(this.updateOf.motivo);
                      this.ofForm.get(['tipo']).setValue(this.updateOf.tipo);
                    });
                    }
               }
  ngOnInit() {

  }
  get fval() {
  return this.ofForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.id_of && this.ofForm.invalid) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      return ;
  }
    if (!this.ofForm.valid) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      return ;
  }
    if (this.id_of && this.ofForm.valid) {
      this.submitted = false;
      this.gasto = this.ofForm.value;
      this._ofS.cudGastosOF().doc(this.id_of).update(this.gasto);
      this.router.navigate(['oficina']);
      this.alert.showSuccess();
  }
    if (!this.id_of && this.ofForm.valid) {
      this.submitted = false;
      this.gasto = this.ofForm.value;
      this._ofS.cudGastosOF().add(this.gasto);
      this.alert.showSuccess();
      this.limpiar();
    }
}

checkLetras($event: KeyboardEvent) {
  this.utils.letras($event);
}

checkNumeros($event: KeyboardEvent) {
  this.utils.numeros($event);
}
checkNumerosP($event: KeyboardEvent) {
  this.utils.numerosp($event);
}
checkCaracteres($event: KeyboardEvent) {
  this.utils.letrasCaracteres($event);
}
limpiar() {
  this.ofForm.get(['resp_asg']).setValue('');
  this.ofForm.get(['fecha']).setValue('');
  this.ofForm.get(['cantidad']).setValue('');
  this.ofForm.get(['motivo']).setValue('');
  this.ofForm.get(['tipo']).setValue('');
}


}


