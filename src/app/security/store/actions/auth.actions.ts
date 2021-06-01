import {Action} from '@ngrx/store';
import { User, UserLog } from '../../model/User';


export const AUTH_LOGIN = '[AUTH] - Login';
export const AUTH_LOGOUT = '[AUTH] - Logout';

export class LoginAction implements Action {

  readonly type = AUTH_LOGIN;

  constructor(public user: UserLog) {
  }
}

export class LogoutAction implements Action {
  readonly type = AUTH_LOGOUT;
}

export type authActions = LoginAction | LogoutAction;