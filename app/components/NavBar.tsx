'use client';

import Link from 'next/link';
import AuthModal from './AuthModal';
import { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../context/AuthContext';
import { deleteCookie } from 'cookies-next';

export default function NavBar() {
  const { data, loading } = useContext(AuthenticationContext);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!loading && data) {
      setInitialLoading(false);
    }
    if (!loading && !data) {
      setInitialLoading(false);
    }
  }, [data, loading]);

  const handleLogOut = () => {
    deleteCookie('jwt');
    location.reload();
  };

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable{' '}
      </Link>
      <div>
        {!initialLoading ? (
          !data ? (
            <div className="flex">
              <AuthModal isSignInButton={true} />
              <AuthModal isSignInButton={false} />
            </div>
          ) : (
            <div className="mx-8 flex">
              <div className="flex gap-3 justify-around mx-5 items-center">
                <div>{data?.first_name}</div>
                <div>{data?.last_name}</div>
              </div>
              <button
                onClick={() => handleLogOut()}
                className="uppercase bg-red-600 w-full text-white p-2 rounded text-sm disabled:bg-gray-400">
                Log out
              </button>
            </div>
          )
        ) : null}
      </div>
    </nav>
  );
}
