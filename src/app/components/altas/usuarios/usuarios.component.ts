import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Usuario } from '../../../general/model/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';
import { AlertasService } from '../../../services/srv_shared/alertas.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  titulo = 'Registrar Usuarios ASG';
  usuario: Usuario;
  loading = true;
  userForm: FormGroup;
  boton = 'Guardar';
  updateU: Usuario;
  // tslint:disable-next-line: variable-name
  id_user: string;
  textError: string;
  submitted = false;
  // tslint:disable-next-line: variable-name
  constructor( private _userS: UsuariosService ,
               private formBuilder: FormBuilder,
               private active: ActivatedRoute,
               private router: Router,
               private utils: Utils,
               public alert: AlertasService) {
                this.loading = true;
                this.userForm = this.formBuilder.group({
                  nombre: ['', Validators.required],
                  puesto: ['', Validators.required]
                });
                if (!this.id_user) {
                  this.loading = false;
                }
                this.id_user = this.active.snapshot.paramMap.get('id_user');
                if (this.id_user) {
                  // tslint:disable-next-line: no-unused-expression
                  this.loading;
                  this.titulo = 'Modificar Usuario ASG';
                  this.boton = 'Actualizar';
                  this._userS.cudUsuarios().doc(this.id_user).valueChanges().subscribe((upusuario: Usuario) => {
                    this.updateU = upusuario;
                    this.userForm.get(['nombre']).setValue(this.updateU.nombre);
                    this.userForm.get(['puesto']).setValue(this.updateU.puesto);
                  });
                  }
      }


  ngOnInit() {
  }
  get fval() {
    return this.userForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (!this.id_user && this.userForm.invalid) {
      // tslint:disable-next-line: no-unused-expression
      this.loading = false ;
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      return ;
  }
    if (!this.userForm.valid) {
      // tslint:disable-next-line: no-unused-expression
      this.loading = false;
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      return ;
  }
    if (this.id_user && this.userForm.valid) {
      this.submitted = false;
      this.loading = false;
      this.usuario = this.userForm.value;
      this._userS.cudUsuarios().doc(this.id_user).update(this.usuario);
      this.router.navigate(['usuarios']);
      }
    if (!this.id_user && this.userForm.valid) {
        this.submitted = false;
        this.loading = false;
        this.usuario = this.userForm.value;
        this._userS.cudUsuarios().add(this.usuario);
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
  limpiar() {
    this.loading = false;
    this.userForm.get(['nombre']).setValue('');
    this.userForm.get(['puesto']).setValue('');
  }
}
