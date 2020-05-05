import {ActionReducerMap} from '@ngrx/store';

import * as reducer from '../reducers/index';

export interface AppState {
  auth: reducer.AuthState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: reducer.authReducer
};
