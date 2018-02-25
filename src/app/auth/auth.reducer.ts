import {AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED} from './auth.actions';

export interface State {
  isAuthenticated: boolean;
}

const initialState: State = {
  isAuthenticated: false
};

export function authReducer(state = initialState, action: AuthActions) {
  console.log('auth reducer:', action.type, state);
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        isAuthenticated: true
      };
    case SET_UNAUTHENTICATED:
      return {
        isAuthenticated: false
      };
    default:
      return state;
  }
}

export const getIsAuth = (state: State) => {
  return state.isAuthenticated;
};
