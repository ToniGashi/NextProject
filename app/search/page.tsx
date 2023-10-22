import SearchHeader from './components/SearchHeader';
import SearchSideBar from './components/SearchSideBar';
import SearchRestaurantCard from './components/SearchRestaurantCard';
import { PrismaClient, PRICE, Review, Location, Cuisine } from '@prisma/client';

const prisma = new PrismaClient();
export interface FilteredRestaurants {
  name: string;
  main_image: string;
  slug: string;
  price: PRICE;
  reviews: Review[];
  location: Location;
  cuisine: Cuisine;
}
const getFilteredRestaurants = async (searchParams: {
  searchBar?: string;
  location?: string;
  cuisine?: string;
  price?: PRICE;
}): Promise<FilteredRestaurants[]> => {
  const filteredRestaurants = await prisma.restaurant.findMany({
    select: {
      name: true,
      slug: true,
      main_image: true,
      cuisine: true,
      location: true,
      price: true,
      reviews: true
    },
    where: {
      AND: [
        {
          location: {
            name: {
              contains: searchParams.location
            }
          }
        },
        {
          cuisine: {
            name: {
              contains: searchParams.cuisine
            }
          }
        },
        {
          price: searchParams.price
        }
      ]
    }
  });

  return filteredRestaurants;
};
const Search = async ({
  searchParams
}: {
  searchParams: {
    searchBar?: string;
    location?: string;
    cuisine?: string;
    price?: PRICE;
  };
}) => {
  const filteredRestaurants = await getFilteredRestaurants(searchParams);
  const temporaryFilteringWord = searchParams.searchBar || '';

  const tempFilteredRestaurants = filteredRestaurants.filter(
    (restaurant) =>
      restaurant.name
        .toLowerCase()
        .includes(temporaryFilteringWord.toLowerCase()) ||
      restaurant.cuisine.name
        .toLowerCase()
        .includes(temporaryFilteringWord.toLowerCase()) ||
      restaurant.location.name
        .toLowerCase()
        .includes(temporaryFilteringWord.toLowerCase()) ||
      restaurant.price
        .toLowerCase()
        .includes(temporaryFilteringWord.toLowerCase())
  );
  return (
    <>
      <SearchHeader searchParams={searchParams} />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        {/* @ts-expect-error Server Component */}
        <SearchSideBar searchParams={searchParams} />
        <div className="w-5/6">
          {tempFilteredRestaurants.length > 0
            ? tempFilteredRestaurants.map((restaurant) => {
                return (
                  /* @ts-expect-error Server Component */
                  <SearchRestaurantCard
                    restaurant={restaurant}
                    key={restaurant.slug}
                  />
                );
              })
            : 'No Restaurants Found'}
        </div>
      </div>
    </>
  );
};

export default Search;
