export enum AuthActionKind {
  UPDATE_EMAIL = 'UPDATE_EMAIL',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  UPDATE_FIRST_NAME = 'UPDATE_FIRST_NAME',
  UPDATE_LAST_NAME = 'UPDATE_LAST_NAME',
  UPDATE_PHONE = 'UPDATE_PHONE',
  UPDATE_CITY = 'UPDATE_CITY'
}

export const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  city: '',
  phone: '',
  email: '',
  password: ''
};

interface AuthAction {
  type: AuthActionKind;
  payload: string;
}

export interface AuthState {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  email: string;
  password: string;
}

export function authReducer(state: AuthState, action: AuthAction) {
  const { type, payload } = action;
  switch (type) {
    case AuthActionKind.UPDATE_EMAIL: {
      return {
        ...state,
        email: payload
      };
    }
    case AuthActionKind.UPDATE_PASSWORD: {
      return {
        ...state,
        password: payload
      };
    }
    case AuthActionKind.UPDATE_FIRST_NAME: {
      return {
        ...state,
        firstName: payload
      };
    }
    case AuthActionKind.UPDATE_LAST_NAME: {
      return {
        ...state,
        lastName: payload
      };
    }
    case AuthActionKind.UPDATE_CITY: {
      return {
        ...state,
        city: payload
      };
    }
    case AuthActionKind.UPDATE_PHONE: {
      return {
        ...state,
        phone: payload
      };
    }
    default:
      return state;
  }
}
