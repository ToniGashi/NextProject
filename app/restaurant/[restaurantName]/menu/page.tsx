'use client'

import { usePathname } from 'next/navigation'
import NavBar from "../../../components/NavBar";
import RestaurantNavBar from '../components/RestaurantNavBar';
import RestaurantHeader from "../components/RestaurantHeader";
import MenuList from "./components/MenuList";

export default function MenuPage() {
  const resaurantName = usePathname().split('/')[2];
  return (
    <main className="bg-gray-100 min-h-screen w-screen text-black">
      <main className="max-w-screen-2xl m-auto bg-white">
      <NavBar />
      <RestaurantHeader />
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        <div className="bg-white w-[100%] rounded p-3 shadow">
          <RestaurantNavBar />
          <MenuList />
        </div>
      </div>
    </main>
  </main>
  )
}