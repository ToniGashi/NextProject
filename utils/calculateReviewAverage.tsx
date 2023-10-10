import { Review } from '@prisma/client';

export default function calculateReviewAverage(reviews: Review[]): number {
  if (reviews.length < 1) return 0;

  const sumOfReviews = reviews.reduce(
    (accumulator, currentReview) => accumulator + currentReview.rating,
    0
  );

  return parseFloat((sumOfReviews / reviews.length).toFixed(1));
}
