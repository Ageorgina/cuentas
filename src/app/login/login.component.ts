import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../security/services/auth.service';
import { AlertasService,  UsuariosService } from '../services';
import { Usuario } from '../general/model';

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
  return3Url: string;
  errorText: string;
  search: any;
  stringSearch: string;
  errorT: string;
  correo: string;
  usuarioL: any;
  userC: any;
  passC: any;
  usuario: any;
  user = new Usuario();

  constructor( private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
               // tslint:disable-next-line:variable-name
               private _authS: AuthService, private alert: AlertasService, private _userS: UsuariosService ) {
    this.loading = false;
    this.submitted = false;
    this._authS.logout();
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required , Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.submitted = false;
    this.loading = false;

    this.route.queryParams.subscribe( data => {
      this.returnUrl = decodeURI (data.returnUrl || '/');
      this.return2Url = decodeURI (data.return2Url || '/');
      this.stringSearch = decodeURI (data.search || '?');
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/registro-reembolso';
    this.return2Url = this.route.snapshot.queryParams.return2Url || '/registro-gastos';
    this.return3Url = this.route.snapshot.queryParams.return3Url || '/reembolsos';
  }


  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.submitted = true;
    if (!this.passC || !this.userC) {
      this.loading = false;
      this.alert.vaciosError();
    }
    if ( this.f.username.value !== null   && this.f.username.value !== '' ) {
    this._userS.cargarUsuarios().subscribe( usuarios => {
    usuarios.filter(usuario => {
        if ( (usuario['correo'] === this.f.username.value) && (usuario['activo'] === true)) {
          this.correo = usuario['correo'];
          this.usuarioL = usuario;
          }
      });
    this.validar();
    }
    );
  } else{
    this.loading = false;
    this.alert.vaciosError();
  }
  }

  validar() {
    if (this.correo === undefined && !this.f.password.value) {
      this.correo = '';
      this.loading = false;
      this.alert.vaciosError();
    }
    this._authS.login(this.f.username.value, this.f.password.value)
              .subscribe(data => {
                if (data === 'U'  && !this._userS.newPass) {
                  this.loading = false;
                  this.alert.serverError();
                  return ;
                } else if (data === 'I') {
                  this.loading = false;
                  if (this.f.username.errors && this.f.password.errors) {
                    this.alert.validError();
                  }
                  if (this.f.username.errors && !this.f.password.errors) {
                    this.alert.invalidUser();
                  } else {
                    console.log('entro I no existe')
                    if (this.correo !== this.f.username.value && !this.f.password.errors) {
                      this.alert.userDoesntExist();
                    }
                  }
                  } else if (data === 'F' && !this._userS.newPass) {
                    this.loading = false;
                    if (this.correo === this.f.username.value && this.loginForm.get( 'password').hasError( 'minlength')) {
                    this.alert.invalidPass();
                } else {
                    this.alert.dontMatch();
                  }
                } else if ( data.access_token) {
                  this.loading = false;
                  if (this.usuarioL['rol'] === 'Usuario') {
                  this.router.navigate([this.returnUrl]);
                  } else {
                    if (this.usuarioL['rol'] === 'Financiero') {
                      this.router.navigate([this.return3Url]);
                    } else {
                  this.router.navigate([this.return2Url]);
                }
              }
            }
          });
  }

  cambioUser(event){
    this.userC = event;
  }
  cambioPass(event){
    this.passC = event;
  }

}
