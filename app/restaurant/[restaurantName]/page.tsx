'use client'

import {usePathname} from 'next/navigation'
import NavBar from '../../components/NavBar';
import RestaurantHeader from './components/RestaurantHeader';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantTitle from './components/RestaurantTitle';
import RestaurantRating from './components/RestaurantRating';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantImages from './components/RestaurantImages';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantReservationCard from './components/RestaurantReservationCard';

export default function RestaurantPage() {
  const resaurantName = usePathname().split('/')[2];
    return (<main className="bg-gray-100 min-h-screen w-screen text-black">
    <main className="max-w-screen-2xl m-auto bg-white">
      <NavBar/>
      <RestaurantHeader/>
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        <div className="bg-white w-[70%] rounded p-3 shadow">
          <RestaurantNavBar/>
          <RestaurantTitle/>
          <RestaurantRating/>
          <RestaurantDescription/>
          <RestaurantImages/>
          <RestaurantReviews/>
        </div>
        <div className="w-[27%] relative text-reg">
          <RestaurantReservationCard/>
        </div>
      </div>
    </main>
  </main>
  )
}