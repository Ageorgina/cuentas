import { Action } from '@ngrx/store';

export const UI_ACTIVAR_LOADING = '[UI Loading] - Cargando';
export const UI_DESACTIVAR_LOADING = '[UI Loading] - Fin de carga ';

export class ActivarLoadingAction implements Action {
  readonly type: string = UI_ACTIVAR_LOADING;
}

export class DesactivarLoadingAction implements Action {
  readonly type: string = UI_DESACTIVAR_LOADING;
}

export type acciones = ActivarLoadingAction | DesactivarLoadingAction;
