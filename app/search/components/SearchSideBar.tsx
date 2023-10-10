import { PrismaClient, PRICE } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

const getAllLocations = async () => {
  const locations = await prisma.location.findMany({
    select: {
      id: true,
      name: true
    }
  });

  return locations;
};

const getAllCuisines = async () => {
  const cuisines = await prisma.cuisine.findMany({
    select: {
      id: true,
      name: true
    }
  });

  return cuisines;
};

export default async function SearchSideBar({
  searchParams
}: {
  searchParams: {
    searchBar?: string;
    location?: string;
    cuisine?: string;
    price?: string;
  };
}) {
  const locations = await getAllLocations();
  const cuisines = await getAllCuisines();

  return (
    <div className="w-1/5">
      <div className="border-b pb-4">
        <h1 className="mb-2">Region</h1>
        {locations.map((location) => (
          <div key={location.id}>
            <Link
              className="font-light text-reg capitalize"
              href={{
                pathname: '/search',
                query: { ...searchParams, location: location.name }
              }}
            >
              {location.name}
            </Link>
          </div>
        ))}
      </div>
      <div className="border-b pb-4 mt-3">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => (
          <div key={cuisine.id}>
            <Link
              className="font-light text-reg capitalize"
              href={{
                pathname: '/search',
                query: { ...searchParams, cuisine: cuisine.name }
              }}
            >
              {cuisine.name}
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          <Link
            className="border w-full text-reg font-light rounded-l p-2"
            href={{
              pathname: '/search',
              query: { ...searchParams, price: PRICE.CHEAP }
            }}
          >
            $
          </Link>
          <Link
            className="border-r border-t border-b w-full text-reg font-light p-2"
            href={{
              pathname: '/search',
              query: { ...searchParams, price: PRICE.REGULAR }
            }}
          >
            $$
          </Link>
          <Link
            className="border-r border-t border-b w-full text-reg font-light p-2 rounded-r"
            href={{
              pathname: '/search',
              query: { ...searchParams, price: PRICE.EXPENSIVE }
            }}
          >
            $$$
          </Link>
        </div>
      </div>
    </div>
  );
}
