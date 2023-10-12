'use client';

import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';

const INITIAL_STATE = {
  loading: true,
  data: null,
  error: null,
  setAuthState: () => {}
};

interface User {
  id: number;
  first_name: string;
  last_name: string;
  city: string;
  phone: string;
  email: string;
}

interface State {
  loading: boolean;
  error: string | string[] | null;
  data: User | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>(INITIAL_STATE);

export default function AuthContext({
  children
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<State>(INITIAL_STATE);

  const fetchUser = async () => {
    try {
      setAuthState({
        loading: true,
        data: null,
        error: null
      });
      const jwt = getCookie('jwt');
      if (!jwt) {
        return setAuthState({
          loading: false,
          data: null,
          error: null
        });
      }

      const { data } = await axios.get('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setAuthState({
        loading: false,
        data: data.user,
        error: null
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
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

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
