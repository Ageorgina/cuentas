import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../security/services/auth.service';
import { AlertasService } from '../services/srv_shared/alertas.service';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = true;
  submitted = false;
  errorLogin = false;
  returnUrl: string;
  return1Url: string;
  return2Url: string;
  errorText: string;
  search: any;
  stringSearch: string;
  errorT: string;
  correo: string;
  usuarioL: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // tslint:disable-next-line:variable-name
    private _authS: AuthService,
    private alert: AlertasService,
    private _userS: UsuariosService
  ) {
    this.loading = false;
    this.usuarioL = JSON.parse(localStorage.getItem('currentUser'));

  }

  ngOnInit() {
    this.submitted = false;
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required , Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.route.queryParams.subscribe( data => {
      this.returnUrl = decodeURI (data.returnUrl || '/');
      this.return2Url = decodeURI (data.return2Url || '/');
      this.stringSearch = decodeURI (data.search || '?');
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/registro-reembolso';
    this.return2Url = this.route.snapshot.queryParams.return2Url || '/registro-gastos';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    this._userS.cargarUsuarios().subscribe(usuarios => {
    usuarios.filter(usuario => {
        if ( (usuario['correo'] === this.f.username.value) && (usuario['activo'] === true)) {
          this.correo = usuario['correo'];
          this.usuarioL = usuario;
          }
      });
    this.validar();
    }
    );

  }
   validar() {
           if (this.correo === undefined) {
            this.correo = '';
          }

           this._authS.login(this.f.username.value, this.f.password.value)
              .subscribe(data => {
                if ((this.f.username.value !== '') && this.correo === this.f.username.value ) {
                  if ( data === 'F') {
                    if (this._userS.newPass === 'exito') {
                      return ;
                    } else if ( !this._userS.newPass) {
                    this.submitted = false;
                    this.loading = false;
                    const errorT = 'Contraseña inválida';
                    this.alert.textError = errorT;
                    this.alert.showError();
                  }
                  }
                  if (data === 'U') {
                    this.loading = false;
                    this.errorT = 'Error en el servidor. Inténtalo más tarde';
                    this.alert.textError = this.errorT;
                    this.alert.showError();
                  } else if (data === 'I') {
                    this.loading = false;
                    this.errorT = 'Datos inválidos';
                    this.alert.textError = this.errorT;
                    this.alert.showError();
                  } else if(data.access_token) {
                      if (this.usuarioL['rol'] === 'Usuario' || this.usuarioL['rol'] === 'Aprobador' ) {
                      this.loading = false;
                      this.router.navigate([this.returnUrl]);
                      } else {
                      this.loading = false;
                      this.router.navigate([this.return2Url]);
                    }
                }
              }  else if (data === 'U') {
                this.loading = false;
                this.errorT = 'Error en el servidor. Inténtalo más tarde';
                this.alert.textError = this.errorT;
                this.alert.showError();
              } else if(this.f.username.value === '' || this.f.password.value === '') {
                this.loading = false;
                this.errorT = 'No se aceptan campos vacios';
                this.alert.textError = this.errorT;
                this.alert.showError();
              } else{
                this.loading = false;
                this.errorT = 'El usuario no existe';
                this.alert.textError = this.errorT;
                this.alert.showError();
              }
            },
            error => {
              this.loading = false;
              const errorText = 'Error del servidor. Intente de nuevo más tarde';
              this.alert.textError = errorText;
              this.alert.showError();
            });
   }

  limpiar() {
    this.loginForm.reset();
  }
}
