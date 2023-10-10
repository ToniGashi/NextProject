import RestaurantNavBar from '../components/RestaurantNavBar';
import MenuList from './components/MenuList';

export default function MenuPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={params.slug} />
        {/* @ts-expect-error Server Component */}
        <MenuList slug={params.slug} />
      </div>
    </>
  );
}
