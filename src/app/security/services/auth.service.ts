
﻿import { Injectable } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
 import { BehaviorSubject, Observable } from 'rxjs';
 import { map } from 'rxjs/operators';
 import { environment } from '../../../environments/environment';
 import { UserLog } from '../model/User';
 import { catchError } from 'rxjs/operators';
 import { Store } from '@ngrx/store';
 import { AppState } from '../../security/store/reducers/app.reducers';
 import { LoginAction, LogoutAction, ActivarLoadingAction, DesactivarLoadingAction } from '../../security/store/actions';
 import { Router } from '@angular/router';
 import { UsuariosService } from '../../services';

 @Injectable({providedIn: 'root'})
export class AuthService {
  userFb:any ;
  userLog = new UserLog;



  constructor( private http: HttpClient, private router: Router, private user: UsuariosService) {

  }



  login(username: string, password: string) {
    this.userFB(username);
    return this.http.post<any>(`${environment.gtosUrl}/login`, {username, password}).pipe(map(user => {
      
      if (user['usuario'].username === this.userFb.correo) {
        
        
        this.userLog.email = username;
        this.userLog.rol = this.userFb.rol;
        this.userLog.status = 200;
        this.userLog.image = this.userFb.imagen;
        this.userLog.refresh = user['refresh_token']
        sessionStorage.setItem('currentUser', JSON.stringify(this.userLog));
        sessionStorage.setItem('token', user['access_token']);
      }
      return this.userLog;
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

 userFB(username) {
     this.user.cargarUsuarios().subscribe( usuarios => {
      this.userFb = usuarios.find(usuario => usuario['correo'] === username)
    });
    
  }

  logout() {
    this.logoutUser().finally(() => {
      this.router.navigate(['/login']);
      return ;
    });
  }

  async logoutUser() {
    //this.store.dispatch(new DesactivarLoadingAction());
    //this.store.dispatch(new LogoutAction());
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    //this.currentUserSubject.next(null);
    sessionStorage.clear();
    localStorage.clear();
  }

  getMenu(name){
    const rol = name.toLowerCase();
    return this.http.get('./assets/menu/'+rol+'.json');
  }

}
