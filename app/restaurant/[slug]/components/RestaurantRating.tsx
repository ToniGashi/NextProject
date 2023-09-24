import { Review } from "@prisma/client";
import calculateReviewAverage from "../../../../utils/calculateReviewAverage";
import Stars from "../../../components/Stars";

export default function RestaurantRating({reviews} : {reviews: Review[]}) {
  const averageRating = calculateReviewAverage(reviews);
    return (
      <div className="flex items-end">
        <div className="ratings mt-2 flex items-center">
          <Stars rating={averageRating} />
          <p className="text-reg ml-3">{}</p>
        </div>
        <div>
          <p className="text-reg ml-4">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    )
}