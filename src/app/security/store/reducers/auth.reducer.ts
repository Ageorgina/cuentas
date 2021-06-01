import { User, UserLog } from '../../model/User';
import * as fromAuth from '../actions/auth.actions';

export interface AuthState {
  user: UserLog;
}

const initState: AuthState = {
  user: null
};

export function authReducer(state = initState, action: fromAuth.authActions): AuthState {

  switch (action.type) {
    case fromAuth.AUTH_LOGIN:
      return {
        user: {
          ...action.user
        }
      };
    case fromAuth.AUTH_LOGOUT:
      return {
        user: null
      };
    default:
      return state;
  }

}