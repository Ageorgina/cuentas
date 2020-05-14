import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AuthService} from '../security/services/auth.service';
import { User } from '../security/model/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  errorLogin = false;
  returnUrl: string;
  return1Url: string;
  return2Url: string;

  search: any;
  stringSearch: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // tslint:disable-next-line:variable-name
    private _authS: AuthService
  ) {
    if (this._authS.currentUserValue) {
      this.router.navigate(['/reembolso']);
     }
  }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required , Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.route.queryParams.subscribe( data => {
      this.returnUrl = decodeURI (data.returnUrl || '/');
      this.stringSearch = decodeURI (data.search || '?');
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/reembolso';
    this.return2Url = this.route.snapshot.queryParams.returnUrl || '/proyectos';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorLogin = false;
    if (this.loginForm.invalid) {
    this.errorLogin = true;
    this.loading = false;
    return ;
    }
    this.loading = false;
    this._authS.login(this.f.email.value, this.f.password.value, 2)
      .pipe(first())
      .subscribe(
        data => {
          console.log('entro data ->');
          console.log('data ->', data);
       /*   if (data === 'e') {
            this.errorLogin = true;
            console.log('Entro en error');
            this.loading = false;
          } else {
            const user = this._authS.currentUserValue;
            if (user) {
              const usuario = user.usuario;
              // if (usuario && this.contieneRol(usuario, 'USUARIO')) {
                   console.log('Entro [USUARIO]');
              //     this.router.navigate([this.returnUrl], {queryParams: this.search});
              //   // console.log('Entro [Usuario]');
              // } else if (usuario && this.contieneRol(usuario, 'GESTOR')) {
              //   this.router.navigate([this.return1Url]);
              //   console.log('Entro [GESTOR]');
              // } else if (usuario && this.contieneRol(usuario, 'TESORERO')) {
              //   this.router.navigate([this.return2Url]);
              //   console.log('Entro [TESORERO]');
              // }
            }
           this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          this.loading = false;
        });
    return;
  }*/
        });

// contieneRol(usuario: User, rol: string){
//      if (usuario.rol) {
//        const ks = Object.keys(usuario.rol);
//        for (const k of ks) {
//          if (usuario.rol[k] === rol) {
//            return true;
//          }
//        }
//      }
//      return false;
//   }

// getUrlParams(search); {
//      const hashes = search.slice(search.indexOf('?') + 1).split('&');
//      const params = {};
//      hashes.map(hash => {
//        const [key, val] = hash.split('=');
//        params[key] = decodeURIComponent(val);
//      });
//      return params;
//    }
        }

      }
