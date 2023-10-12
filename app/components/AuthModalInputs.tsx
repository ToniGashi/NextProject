import React from 'react';
import { AuthState, AuthActionKind } from './AuthModal';

interface AuthModalInputProps {
  state: AuthState;
  dispatch: (action) => void;
  isSignInButton: boolean;
}

const AuthModalInputs: React.FC<AuthModalInputProps> = ({
  state,
  dispatch,
  isSignInButton
}) => {
  return !isSignInButton ? (
    <div className="my-3 flex justify-between text-sm flex-wrap gap-3">
      <div className="my-3 gap-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-1/2"
          placeholder="First name"
          value={state.firstName}
          onChange={(e) =>
            dispatch({
              type: AuthActionKind.UPDATE_FIRST_NAME,
              payload: e.target.value
            })
          }
        />
        <input
          type="text"
          className="border rounded p-2 py-3 w-1/2"
          placeholder="Last name"
          value={state.lastName}
          onChange={(e) =>
            dispatch({
              type: AuthActionKind.UPDATE_LAST_NAME,
              payload: e.target.value
            })
          }
        />
      </div>
      <input
        type="text"
        className="border rounded p-2 py-3 w-full"
        placeholder="Email"
        value={state.email}
        onChange={(e) =>
          dispatch({
            type: AuthActionKind.UPDATE_EMAIL,
            payload: e.target.value
          })
        }
      />
      <div className="my-3 gap-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-1/2"
          placeholder="Phone"
          value={state.phone}
          onChange={(e) =>
            dispatch({
              type: AuthActionKind.UPDATE_PHONE,
              payload: e.target.value
            })
          }
        />
        <input
          type="text"
          className="border rounded p-2 py-3 w-1/2"
          placeholder="City"
          value={state.city}
          onChange={(e) =>
            dispatch({
              type: AuthActionKind.UPDATE_CITY,
              payload: e.target.value
            })
          }
        />
      </div>
      <input
        type="password"
        className="border rounded p-2 py-3 w-full"
        placeholder="Password"
        value={state.password}
        onChange={(e) =>
          dispatch({
            type: AuthActionKind.UPDATE_PASSWORD,
            payload: e.target.value
          })
        }
      />
    </div>
  ) : (
    <div className="my-3 flex justify-between text-sm flex-wrap gap-3">
      <input
        type="text"
        className="border rounded p-2 py-3 w-full"
        placeholder="Email"
        value={state.email}
        onChange={(e) =>
          dispatch({
            type: AuthActionKind.UPDATE_EMAIL,
            payload: e.target.value
          })
        }
      />
      <input
        type="password"
        className="border rounded p-2 py-3 w-full"
        placeholder="Password"
        value={state.password}
        onChange={(e) =>
          dispatch({
            type: AuthActionKind.UPDATE_PASSWORD,
            payload: e.target.value
          })
        }
      />
    </div>
  );
};

export default AuthModalInputs;
