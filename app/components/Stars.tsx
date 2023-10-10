import fullStar from '../../public/full-star.png';
import halfStar from '../../public/half-star.png';
import emptyStar from '../../public/empty-star.png';

import Image from 'next/image';

const Stars = ({ rating }: { rating: number }) => {
  const isFloatingNumber = rating % 1 !== 0;
  const baseStars = Math.floor(rating);
  const emptyStars = isFloatingNumber ? 5 - baseStars - 1 : 5 - baseStars;

  return (
    <div className="flex mb-2">
      {[...Array(baseStars)].map((n, i) => (
        <span key={i}>
          <Image src={fullStar} alt="" width={12} />
        </span>
      ))}
      {isFloatingNumber && (
        <span>
          <Image src={halfStar} alt="" width={12} />
        </span>
      )}
      {[...Array(emptyStars)].map((n, i) => (
        <span key={i}>
          <Image src={emptyStar} alt="" width={12} />
        </span>
      ))}
    </div>
  );
};

export default Stars;
