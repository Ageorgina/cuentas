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
  returnUrl: string;
  return1Url: string;
  return2Url: string;
  return3Url: string;
  search: any;
  stringSearch: string;
  correo: string;
  usuarioL: Usuario;
  respuesta: any;

  constructor( private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
               private auth: AuthService, private alert: AlertasService, private userS: UsuariosService ) {
                 this.auth.logout();
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
      this.stringSearch = decodeURI (data.search || '?');
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/registro-reembolso';
    this.return1Url = this.route.snapshot.queryParams.returnUrl || '/registro-gastos';
    this.return2Url = this.route.snapshot.queryParams.returnUrl || '/reembolsos';
  }


  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.submitted = true;
    if ( this.f.username.value !== '' && this.f.password.value !== '' ) {
      this.login();
    } else {
      this.loading = false;
      this.alert.vaciosError();
    }
  }

  login() {
    this.auth.login(this.f.username.value, this.f.password.value).subscribe( data => {
      this.respuesta = data;
      if (this.respuesta['respuesta'] === undefined) {
        this.entroError();
      } else {
        this.entroExitoso();
      }
    });
  }

  entroExitoso() {
    if (this.respuesta['rol'] === 'Usuario') {
        this.router.navigate([this.returnUrl]);
    } else if (this.respuesta['rol'] === 'Financiero') {
        this.router.navigate([this.return2Url]);
      } else {
          this.router.navigate([this.return1Url]);
      }
  }

  entroError() {
    if (this.respuesta === 'U') {
      this.loading = false;
      this.alert.showError();
    } else if (this.respuesta === 'I') {
      this.loading = false;
      if (this.f.username.errors && this.f.password.errors) {
        this.alert.validError();
      }
      if (this.f.username.errors && !this.f.password.errors) {
        this.alert.invalidUser();
      } else {
        if (this.correo !== this.f.username.value && !this.f.password.errors) {
          this.alert.userDoesntExist();
        }
      }
    } else if (this.respuesta === 'F') {
      this.loading = false;
      if (!this.userS.newPass ) {
        if (this.f.username.value && this.loginForm.get( 'password').hasError( 'minlength')) {
          this.alert.invalidPass();
        } else {
          this.alert.dontMatch();
        }
      }
    }
  }

}
