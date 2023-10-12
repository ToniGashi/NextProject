import axios from 'axios';
import { AuthState } from '../app/components/AuthModal';
import { useContext } from 'react';
import { AuthenticationContext } from '../app/context/AuthContext';

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);

  const signIn = async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => {
    setAuthState({
      loading: true,
      data: null,
      error: null
    });
    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/auth/signin',
        {
          email,
          password
        }
      );
      setAuthState({
        loading: false,
        data: data.user,
        error: null
      });
      return data;
    } catch ({
      response: {
        data: { errorMessage }
      }
    }) {
      setAuthState({
        loading: false,
        data: null,
        error: errorMessage
      });
      return undefined;
    }
  };

  const signUp = async ({
    email,
    password,
    firstName,
    lastName,
    phone,
    city
  }: AuthState) => {
    try {
      setAuthState({
        loading: true,
        data: null,
        error: null
      });
      const { data } = await axios.post(
        'http://localhost:3000/api/auth/signup',
        {
          email,
          password,
          firstName,
          lastName,
          phone,
          city
        }
      );
      setAuthState({
        loading: false,
        data: data.user,
        error: null
      });
      return data;
    } catch ({
      response: {
        data: { errorMessage }
      }
    }) {
      setAuthState({
        loading: false,
        data: null,
        error: errorMessage
      });
      return undefined;
    }
  };

  return {
    signIn,
    signUp
  };
};

export default useAuth;
