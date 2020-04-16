import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Usuario } from '../../../general/model/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { Area } from '../../../general/model/area';
import { AreasService } from '../../../services/areas.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  titulo = 'Registrar Usuarios ASG';
  usuario: Usuario;
  usuarios: Usuario[];
  area: Area;
  areas: Area[];
  loading = true;
  userForm: FormGroup;
  boton = 'Guardar';
  updateU: Usuario;
  // tslint:disable-next-line: variable-name
  id_user: string;
  textError: string;
  submitted = false;
  actualizar = false;
  // tslint:disable-next-line: variable-name
  constructor( private _userS: UsuariosService ,
               // tslint:disable-next-line:variable-name
               private _areaS: AreasService,
               private formBuilder: FormBuilder,
               private active: ActivatedRoute,
               private router: Router,
               private utils: Utils,
               public alert: AlertasService) {
                this.userForm = this.formBuilder.group({
                  nombre: ['', Validators.required],
                  ap_p: ['', Validators.required],
                  ap_m: ['', Validators.required],
                  correo: ['', [Validators.required, Validators.email]],
                  password: ['', Validators.required],
                  area: ['', Validators.required],
                  resp_asg: ['', Validators.required],
                  puesto: ['', Validators.required],
                  resp_area: ['']
                });

                this._areaS.cargarAreas().subscribe((areas: Area[]) => { this.areas = areas;  });
                this._userS.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
                  this.usuarios = [];
                  usuarios.filter(responsable => {
                      if (responsable.resp_area === true) {
                        this.usuarios.push(responsable);
                       }
                  });
                });

                this.id_user = this.active.snapshot.paramMap.get('id_user');
                if (this.id_user) {
                  // tslint:disable-next-line: no-unused-expression
                  this.loading;
                  this.titulo = 'Modificar Usuario ASG';
                  this.actualizar = true;
                  this._userS.cudUsuarios().doc(this.id_user).valueChanges().subscribe((upusuario: Usuario) => {
                    this.updateU = upusuario;
                    this.userForm.get(['nombre']).setValue(this.updateU.nombre);
                    this.userForm.get(['ap_p']).setValue(this.updateU.ap_p);
                    this.userForm.get(['ap_m']).setValue(this.updateU.ap_m);
                    this.userForm.get(['correo']).setValue(this.updateU.correo);
                    this.userForm.get(['password']).setValue(this.updateU.password);
                    this.userForm.get(['resp_area']).setValue(this.updateU.resp_area);
                    this.userForm.get(['resp_asg']).setValue(this.updateU.resp_asg);
                    this.userForm.get(['area']).setValue(this.updateU.area);
                    this.userForm.get(['puesto']).setValue(this.updateU.puesto);
                  });
                  }
      }



  ngOnInit() {
    this.loading = false;
  }
  get fval() {
    return this.userForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (!this.id_user && this.userForm.invalid) {
      // tslint:disable-next-line: no-unused-expression

      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
  }
    if (!this.userForm.valid) {
      // tslint:disable-next-line: no-unused-expression
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
  }
    if (this.id_user && this.userForm.valid) {
      this.submitted = false;
      this.usuario = this.userForm.value;
      this._userS.cudUsuarios().doc(this.id_user).update(this.usuario);
      this.router.navigate(['usuarios']);
      this.loading = false;
      }
    if (!this.id_user && this.userForm.valid) {
        this.submitted = false;
        this.usuario = this.userForm.value;
        this._userS.cudUsuarios().add(this.usuario);
        this.alert.showSuccess();
        this.loading = false;
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
    this.userForm.reset();
    this.userForm.get(['resp_area']).reset('');
    this.userForm.get(['resp_asg']).setValue('');
    this.userForm.get(['area']).setValue('');
  }

  regresar() {
    this.router.navigate(['usuarios']);
  }

}
