const renderTitle = (title: string) => {
  const titleArray = title?.split('-');
  titleArray[titleArray.length - 1] = `(${titleArray[titleArray.length - 1]})`;
  return titleArray.join(' ');
};

export default function RestaurantHeader({ slug }: { slug: string }) {
  return (
    <div className="h-96 overflow-hidden">
      <div className="bg-center bg-gradient-to-r from-[#0f1f47] to-[#5f6984] h-full flex justify-center items-center">
        <h1 className="text-7xl text-white capitalize text-shadow text-center">
          {renderTitle(slug)}
        </h1>
      </div>
    </div>
  );
}
