
﻿import {Injectable} from '@angular/core';
 import {HttpClient} from '@angular/common/http';
 import {BehaviorSubject, Observable, Subscription} from 'rxjs';
 import {map} from 'rxjs/operators';

 import {environment} from '../../../environments/environment';
 import {User} from '../model/User';
 import {catchError} from 'rxjs/operators';
 import {Store} from '@ngrx/store';
 import {AppState} from '../../security/store/reducers/app.reducers';
 import {LoginAction, LogoutAction} from '../../security/store/actions/auth.actions';

 @Injectable({providedIn: 'root'})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;


  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, idModulo: number) {
    localStorage.removeItem('currentUser');
    return this.http.post<any>(`${environment.gtosUrl}/entrar`, {email, password, idModulo})
      .pipe(map(user => {
        if (user && user.resultado.access_token) {
           console.log('currentUser', user.resultado);
           localStorage.setItem('currentUser', JSON.stringify(user.resultado));
           this.currentUserSubject.next(user.resultado);
           this.store.dispatch(new LoginAction(user.resultado));
        }
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.store.dispatch(new LogoutAction());
  }
}
