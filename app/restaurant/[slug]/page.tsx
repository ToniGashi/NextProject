import { PrismaClient } from '@prisma/client';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantTitle from './components/RestaurantTitle';
import RestaurantRating from './components/RestaurantRating';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantImages from './components/RestaurantImages';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantReservationCard from './components/RestaurantReservationCard';

const prisma = new PrismaClient();

interface RestaurantType {
  id: number;
  name: string;
  description: string;
  images: string[];
  slug: string;
}
const fetchRestaurantBySlug = async (slug: string): Promise<RestaurantType> => {
  const restaurant = await prisma.restaurant.findUnique({
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
    },
    where: {
      slug: slug
    }
  })

  if(!restaurant) throw 'No restaurant with this slug';
  return restaurant;
}

export default async function RestaurantPage({params}: {params: {slug: string}}) {
  const restaurant = await fetchRestaurantBySlug(params.slug)
    return (
      <>
        <div className="bg-white w-[70%] rounded p-3 shadow">
          <RestaurantNavBar slug={restaurant.slug}/>
          <RestaurantTitle title={restaurant.name}/>
          <RestaurantRating/>
          <RestaurantDescription description={restaurant.description}/>
          <RestaurantImages images={restaurant.images}/>
          <RestaurantReviews/>
        </div>
        <div className="w-[27%] relative text-reg">
          <RestaurantReservationCard/>
        </div>
      </>
  )
}