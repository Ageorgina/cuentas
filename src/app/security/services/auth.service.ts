
﻿import {Injectable} from '@angular/core';
 import {HttpClient} from '@angular/common/http';
 import {BehaviorSubject, Observable, Subscription} from 'rxjs';
 import {map} from 'rxjs/operators';

 import {environment} from '../../../environments/environment';
 import {User} from '../model/User';
 import {catchError} from 'rxjs/operators';
 import {Store} from '@ngrx/store';
 import {AppState} from '../../security/store/reducers/app.reducers';
 import {LoginAction, LogoutAction, DesactivarLoadingAction} from '../../security/store/actions';
 import { UsuariosService } from '../../services/usuarios.service';
 import { Usuario } from '../../general/model/usuario';
import { Router } from '@angular/router';

 @Injectable({providedIn: 'root'})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public loading: boolean;
  public admin: string;
  public usuario: string;
  public tesorero: string;

  constructor( private http: HttpClient,
               private store: Store<AppState>,
               private userS: UsuariosService,
               private router: Router) {
    localStorage.removeItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.gtosUrl}/login`, {username, password})
      .pipe(map(user => {
        if (user && user.access_token ) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.store.dispatch(new LoginAction(user));
          }
        this.store.dispatch(new DesactivarLoadingAction());
        return user;
        }), catchError(err => {
          if ( err.statusText === 'Internal Server Error') {
            return 'I';
          } else if (err.statusText === 'Unauthorized') {
            return 'F';
          } else {
            return 'U';
          }
        }));
    }

  usuariofb() {
    this.userS.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
      usuarios.filter(responsable => {
        if (responsable.correo === this.currentUserValue.usuario.username) {
          if (responsable.rol === 'Administrador') {
            return this.admin = responsable.rol;
          } else if (responsable.rol === 'Usuario') {
            return this.usuario = responsable.rol;
          } else if (responsable.rol === 'Tesorero') {
            return this.tesorero = responsable.rol;
          }
        }
      });
    });
  }

  logout() {
    window.onload = function (){
      window.localStorage.clear();
    }
    this.store.dispatch(new DesactivarLoadingAction());
    this.store.dispatch(new LogoutAction());
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    console.log('refresco')
  }
}
