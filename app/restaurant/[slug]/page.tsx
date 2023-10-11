import { PrismaClient, Review } from '@prisma/client';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantTitle from './components/RestaurantTitle';
import RestaurantRating from './components/RestaurantRating';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantImages from './components/RestaurantImages';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantReservationCard from './components/RestaurantReservationCard';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

interface RestaurantType {
  id: number;
  name: string;
  description: string;
  images: string[];
  reviews: Review[];
  slug: string;
}
const fetchRestaurantBySlug = async (slug: string): Promise<RestaurantType> => {
  const restaurant = await prisma.restaurant.findUnique({
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      reviews: true,
      slug: true
    },
    where: {
      slug: slug
    }
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function RestaurantPage({
  params
}: {
  params: { slug: string };
}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <RestaurantTitle title={restaurant.name} />
        <RestaurantRating reviews={restaurant.reviews} />
        <RestaurantDescription description={restaurant.description} />
        <RestaurantImages images={restaurant.images} />
        <RestaurantReviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <RestaurantReservationCard />
      </div>
    </>
  );
}
