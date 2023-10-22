'use client';

import axios from 'axios';
import { useReducer, useState } from 'react';

export enum ReservationActionKind {
  UPDATE_BOOKER_FIRST_NAME = 'UPDATE_FIRST_NAME',
  UPDATE_BOOKER_LAST_NAME = 'UPDATE_LAST_NAME',
  UPDATE_BOOKER_EMAIL = 'UPDATE_EMAIL',
  UPDATE_BOOKER_PHONE = 'UPDATE_PHONE',
  UPDATE_BOOKER_OCCASION = 'UPDATE_OCCASION',
  UPDATE_BOOKER_REQUEST = 'UPDATE_REQUEST'
}

const INITIAL_STATE = {
  bookerFirstName: '',
  bookerLastName: '',
  bookerEmail: '',
  bookerPhone: '',
  bookerOccasion: '',
  bookerRequest: ''
};

interface ReservationAction {
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

function reservationReducer(
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
export default function Form({
  partySize,
  time,
  date
}: {
  partySize: string;
  time: string;
  date: string;
}) {
  const [state, dispatch] = useReducer(reservationReducer, INITIAL_STATE);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const isButtonDisabled = () => {
    return Object.keys(state).find(
      (el) =>
        state[el] === '' && !['bookerRequest', 'bookerOccasion'].includes(el)
    ) !== undefined
      ? true
      : false;
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?time=${time}&day=${date}&partySize=${partySize}`,
        {
          bookerEmail: state.bookerEmail,
          bookerFirstName: state.bookerFirstName,
          bookerLastName: state.bookerLastName,
          bookerPhone: state.bookerPhone,
          bookerOccasion: state.bookerOccasion,
          bookerRequest: state.bookerRequest
        }
      );
      setErrorText('');
      setSuccessText('Booking created successfully');
    } catch ({
      response: {
        data: { errorMessage }
      }
    }) {
      setErrorText(errorMessage);
      setSuccessText('');
    }
  };

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="First name"
        value={state.bookerFirstName}
        onChange={(e) =>
          dispatch({
            type: ReservationActionKind.UPDATE_BOOKER_FIRST_NAME,
            payload: e.target.value
          })
        }
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Last name"
        value={state.bookerLastName}
        onChange={(e) =>
          dispatch({
            type: ReservationActionKind.UPDATE_BOOKER_LAST_NAME,
            payload: e.target.value
          })
        }
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Phone number"
        value={state.bookerPhone}
        onChange={(e) =>
          dispatch({
            type: ReservationActionKind.UPDATE_BOOKER_PHONE,
            payload: e.target.value
          })
        }
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Email"
        value={state.bookerEmail}
        onChange={(e) =>
          dispatch({
            type: ReservationActionKind.UPDATE_BOOKER_EMAIL,
            payload: e.target.value
          })
        }
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Occasion (optional)"
        value={state.bookerOccasion}
        onChange={(e) =>
          dispatch({
            type: ReservationActionKind.UPDATE_BOOKER_OCCASION,
            payload: e.target.value
          })
        }
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Requests (optional)"
        value={state.bookerRequest}
        onChange={(e) =>
          dispatch({
            type: ReservationActionKind.UPDATE_BOOKER_REQUEST,
            payload: e.target.value
          })
        }
      />
      {errorText.length > 0 && <p className="text-red-600 mb-3">{errorText}</p>}
      {successText.length > 0 && <p className="text-green-600 mb-3">{successText}</p>}
      <button
        disabled={isButtonDisabled()}
        onClick={handleSubmit}
        className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300">
        Complete reservation
      </button>
      <p className="mt-4 text-sm">
        By clicking “Complete reservation” you agree to the OpenTable Terms of
        Use and Privacy Policy. Standard text message rates may apply. You may
        opt out of receiving text messages at any time.
      </p>
    </div>
  );
}
