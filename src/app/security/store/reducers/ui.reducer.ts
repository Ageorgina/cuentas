

import * as fromUI from '../actions/ui.actions';

export interface UIState {
  isLoading: boolean;
}

const initState: UIState = {
  isLoading: false
};

export function uiReducer(state = initState, action: fromUI.acciones): UIState {
  switch (action.type) {
    case fromUI.UI_ACTIVAR_LOADING:
      return {
        isLoading: true
      };
    case fromUI.UI_DESACTIVAR_LOADING:
      return {
        isLoading: false
      };
    default:
      return state;
  }
}
