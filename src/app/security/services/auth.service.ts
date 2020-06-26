
﻿import { Injectable } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
 import { BehaviorSubject, Observable } from 'rxjs';
 import { map } from 'rxjs/operators';
 import { environment } from '../../../environments/environment';
 import { User} from '../model/User';
 import { catchError } from 'rxjs/operators';
 import { Store } from '@ngrx/store';
 import { AppState } from '../../security/store/reducers/app.reducers';
 import { LoginAction, LogoutAction, ActivarLoadingAction, DesactivarLoadingAction } from '../../security/store/actions';
 import { Router } from '@angular/router';
 import { UsuariosService } from '../../services';
 import { Usuario } from '../../general/model';

 @Injectable({providedIn: 'root'})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public loading: boolean;
  private correo: string;
  public userFb: any;
  public admin: boolean;
  public aprobador: boolean;
  public tesorero: boolean;
  public financiero: boolean;
  public rolU: boolean;


  constructor( private http: HttpClient, private store: Store<AppState>, private router: Router, private user: UsuariosService) {
    localStorage.removeItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    this.correo = username;
    this.userFB();
    this.store.dispatch(new ActivarLoadingAction());
    return this.http.post<any>(`${environment.gtosUrl}/login`, {username, password}).pipe(map(user => {
      if (user.usuario.username === this.userFb.correo) {
        this.userFb.respuesta = user;
        this.admin = this.userFb.rol === 'Administrador';
        this.aprobador = this.userFb.rol === 'Aprobador';
        this.tesorero = this.userFb.rol === 'Tesorero';
        this.financiero = this.userFb.rol === 'Financiero';
        this.rolU = this.userFb.rol === 'Usuario';
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.store.dispatch(new LoginAction(user));
      }
      this.store.dispatch(new DesactivarLoadingAction());
      return this.userFb;
    }), catchError(err => {
      if ( err.statusText === 'Internal Server Error') {
        return 'I';
      } else if (err.statusText === 'Unauthorized'  ) {
        return 'F';
      } else {
        return 'U';
      }
    })
    );
  }

 userFB() {
    this.user.cargarUsuarios().subscribe( usuarios => {
      usuarios.filter( (usuario: Usuario) => {
        if (this.correo === usuario.correo) {
          this.userFb = usuario;
        }
      });
    });
  }

  logout() {
    this.logoutUser().finally(() => {
      this.router.navigate(['/login']);
      return ;
    });
  }

  async logoutUser() {
    this.store.dispatch(new DesactivarLoadingAction());
    this.store.dispatch(new LogoutAction());
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    localStorage.clear();
  }

}
