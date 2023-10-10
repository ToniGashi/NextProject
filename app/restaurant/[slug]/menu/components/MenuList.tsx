import { PrismaClient } from '@prisma/client';
import MenuCard from './MenuCard';

const prisma = new PrismaClient();

export interface ItemType {
  id: number;
  name: string;
  price: string;
  description: string;
  restaurant_id: number;
  created_at: Date;
  updated_at: Date;
}

const fetchRestaurantMenuItems = async (slug: string): Promise<ItemType[]> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: slug
    },
    select: {
      items: true
    }
  });
  if (!restaurant?.items) throw 'no restaurant items found';
  return restaurant.items;
};

const MenuList = async ({ slug }: { slug: string }) => {
  const menuItems = await fetchRestaurantMenuItems(slug);
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="font-bold text-4xl">Menu</h1>
        </div>
        <div className="flex flex-wrap justify-between">
          {menuItems.length ? (
            menuItems.map((menuItem) => (
              <MenuCard key={menuItem.id} menuItem={menuItem} />
            ))
          ) : (
            <p>This restaurant has no items in it's menu for now</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default MenuList;
