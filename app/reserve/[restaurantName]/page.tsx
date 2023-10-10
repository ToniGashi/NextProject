'use client'

import {usePathname} from 'next/navigation'
import Form from './components/Form';
import Header from './components/Header';

export default function ReservePage() {
  const resaurantName = usePathname()?.split('/')[2];
    return ( 
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          <Header/>
          <Form/>
        </div>
      </div>
  )
}