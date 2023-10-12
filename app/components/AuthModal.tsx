'use client';

import { useContext, useReducer, useState } from 'react';
import { Box, Typography, Modal, Alert } from '@mui/material';
import AuthModalInputs from './AuthModalInputs';
import useAuth from '../../hooks/useAuth';
import Loader from './Loader';
import { AuthenticationContext } from '../context/AuthContext';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export enum AuthActionKind {
  UPDATE_EMAIL = 'UPDATE_EMAIL',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  UPDATE_FIRST_NAME = 'UPDATE_FIRST_NAME',
  UPDATE_LAST_NAME = 'UPDATE_LAST_NAME',
  UPDATE_PHONE = 'UPDATE_PHONE',
  UPDATE_CITY = 'UPDATE_CITY'
}

const INITIAL_STATE = {
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

function authReducer(state: AuthState, action: AuthAction) {
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

export default function AuthModal({
  isSignInButton
}: {
  isSignInButton: boolean;
}) {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);
  const [open, setOpen] = useState(false);
  const { loading, error } = useContext(AuthenticationContext);
  const { signIn, signUp } = useAuth();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderContent = (signInContent: string, signUpContent: string) => {
    return isSignInButton ? signInContent : signUpContent;
  };

  const renderError = (error: string | string[] | null) => {
    if (error) {
      if (typeof error === 'string')
        return (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        );
      else {
        return error.map((error) => (
          <Alert key={error} severity="error" className="mb-4">
            {error}
          </Alert>
        ));
      }
    }
  };

  const shouldBeDisabled = () => {
    if (!isSignInButton) {
      return Object.values(state).find((el) => el === '') === undefined
        ? false
        : true;
    }
    return state.email === '' || state.password === '';
  };

  const handleClick = async () => {
    if (isSignInButton) {
      const resp = await signIn({
        email: state.email,
        password: state.password
      });

      if (resp) {
        handleClose();
      }
    } else {
      const resp = await signUp({ ...state });

      if (resp) {
        handleClose();
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className={`${renderContent(
          'bg-blue-400 text-white',
          ''
        )} border p-1 px-4 rounded mr-3`}>
        {renderContent('Sign In', 'Sign Up')}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="text-black">
        <Box sx={style}>
          {loading ? (
            <Loader />
          ) : (
            <div className="p-2 h-[600px]">
              {renderError(error)}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-sm">
                  {renderContent('Sign In', 'Create Account')}
                </p>
              </div>
              <div>
                <Typography className="text-2xl font-light text-center">
                  {renderContent(
                    'Sign in to your account',
                    'Create an account'
                  )}
                </Typography>
                <AuthModalInputs
                  isSignInButton={isSignInButton}
                  state={state}
                  dispatch={dispatch}
                />
                <button
                  disabled={shouldBeDisabled()}
                  onClick={() => handleClick()}
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm disabled:bg-gray-400">
                  {renderContent('Sign in', 'Create account')}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
