export enum ReservationActionKind {
  UPDATE_BOOKER_FIRST_NAME = 'UPDATE_FIRST_NAME',
  UPDATE_BOOKER_LAST_NAME = 'UPDATE_LAST_NAME',
  UPDATE_BOOKER_EMAIL = 'UPDATE_EMAIL',
  UPDATE_BOOKER_PHONE = 'UPDATE_PHONE',
  UPDATE_BOOKER_OCCASION = 'UPDATE_OCCASION',
  UPDATE_BOOKER_REQUEST = 'UPDATE_REQUEST'
}

export const INITIAL_STATE = {
  bookerFirstName: '',
  bookerLastName: '',
  bookerEmail: '',
  bookerPhone: '',
  bookerOccasion: '',
  bookerRequest: ''
};

export interface ReservationAction {
  type: ReservationActionKind;
  payload: string;
}

export interface ReservationState {
  bookerFirstName: string;
  bookerLastName: string;
  bookerEmail: string;
  bookerPhone: string;
  bookerOccasion: string;
  bookerRequest: string;
}

export function reservationReducer(
  state: ReservationState,
  action: ReservationAction
) {
  const { type, payload } = action;
  switch (type) {
    case ReservationActionKind.UPDATE_BOOKER_FIRST_NAME: {
      return {
        ...state,
        bookerFirstName: payload
      };
    }
    case ReservationActionKind.UPDATE_BOOKER_LAST_NAME: {
      return {
        ...state,
        bookerLastName: payload
      };
    }
    case ReservationActionKind.UPDATE_BOOKER_EMAIL: {
      return {
        ...state,
        bookerEmail: payload
      };
    }
    case ReservationActionKind.UPDATE_BOOKER_PHONE: {
      return {
        ...state,
        bookerPhone: payload
      };
    }
    case ReservationActionKind.UPDATE_BOOKER_OCCASION: {
      return {
        ...state,
        bookerOccasion: payload
      };
    }
    case ReservationActionKind.UPDATE_BOOKER_REQUEST: {
      return {
        ...state,
        bookerRequest: payload
      };
    }
    default:
      return state;
  }
}
