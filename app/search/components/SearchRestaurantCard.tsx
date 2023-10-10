import Link from 'next/link';
import Price from '../../components/Price';
import { FilteredRestaurants } from '../page';
import calculateReviewAverage from '../../../utils/calculateReviewAverage';
import Stars from '../../components/Stars';

export default async function SearchRestaurantCard({
  restaurant
}: {
  restaurant: FilteredRestaurants;
}) {
  const averageRating = calculateReviewAverage(restaurant.reviews);

  const renderRatingText = () => {
    if (averageRating > 4) return 'Awesome';
    if (averageRating > 3 && averageRating <= 4) return 'Good';
    if (averageRating > 2 && averageRating <= 3) return 'Average';
    if (averageRating <= 2) return 'Bad';
  };

  return (
    <div className="border-b flex pb-5 ml-4">
      <Link href={`/restaurant/${restaurant.slug}`}>
        <img src={restaurant.main_image} alt="" className="w-44 h-36 rounded" />
      </Link>
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <Stars rating={averageRating} />
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={restaurant.price} />
            <p className="mr-4 capitalize">{restaurant.cuisine.name}</p>
            <p className="mr-4 capitalize">{restaurant.location.name}</p>
          </div>
        </div>
        <div className="text-red-600">View more information</div>
      </div>
    </div>
  );
}
