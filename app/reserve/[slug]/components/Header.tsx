import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
}

const fetchRestaurant = async (slug: string): Promise<RestaurantCardType> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true,
      main_image: true
    }
  });

  if (!restaurant) {
    throw 'No restaurant found';
  }

  return restaurant;
};

export default async function Header({
  slug,
  partySize,
  time,
  date
}: {
  slug: string;
  partySize: string;
  time: string;
  date: string;
}) {
  const restaurant = await fetchRestaurant(slug);

  return (
    <div>
      <h3 className="font-bold">You are almost done!</h3>
      <div className="mt-5 flex">
        <img src={restaurant.main_image} alt="" className="w-32 h-18 rounded" />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="flex mt-3">
            <p className="mr-6">{dayjs(date).format('DD MMM YYYY')}</p>
            <p className="mr-6">{time.substring(0, 5)}</p>
            <p className="mr-6">{partySize} people</p>
          </div>
        </div>
      </div>
    </div>
  );
}
