import React from 'react';
import NavBar from './components/NavBar';
import './globals.css';
import AuthContext from './context/AuthContext';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthContext>
          <main className="bg-gray-100 min-h-screen w-screen text-black">
            <main className="max-w-screen-2xl m-auto bg-white">
              <NavBar />
              {children}
            </main>
          </main>
        </AuthContext>
      </body>
    </html>
  );
}
