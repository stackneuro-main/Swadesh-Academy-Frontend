import { Star } from "lucide-react";

import { useGoogleReviews } from "../features/reviews/hooks/useGoogleReviews";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatRating(rating) {
  const value = Number(rating) || 0;
  return Number.isInteger(value) ? value.toFixed(1) : value.toFixed(1);
}

function RatingStars({ rating }) {
  const roundedRating = Math.round(Number(rating) || 0);

  return (
    <div className="flex items-center gap-1" aria-label={`${formatRating(rating)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={17}
          className={index < roundedRating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
        />
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <span
      aria-label="Google review"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white font-heading text-sm font-bold shadow-sm"
    >
      <span className="text-blue-600">G</span>
    </span>
  );
}

function ReviewCard({ review }) {
  const initials = getInitials(review.reviewer_name || "Swadesh Academy");

  return (
    <a
      href={review.google_url}
      target="_blank"
      rel="noopener noreferrer"
      className="review-marquee-card group"
      aria-label={`Open ${review.reviewer_name}'s Google review in a new tab`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-blue-900/15">
            {review.profile_image ? (
              <img
                src={review.profile_image}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-950">{review.reviewer_name}</h3>
            <p className="truncate text-xs font-semibold text-slate-500">{review.review_date}</p>
          </div>
        </div>
        <GoogleMark />
      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm font-bold text-slate-700">{formatRating(review.rating)}</span>
        <RatingStars rating={review.rating} />
      </div>

      <p className="review-text-fade mt-4 text-sm leading-7 text-slate-600">{review.review_text}</p>

      <span className="mt-5 inline-flex text-xs font-bold uppercase tracking-[0.18em] text-blue-600 transition group-hover:text-slate-950">
        View on Google
      </span>
    </a>
  );
}

function ReviewMarqueeRow({ reviews, reverse = false }) {
  const repeatedReviews = [...reviews, ...reviews];

  return (
    <div className="review-marquee">
      <div className={`review-marquee-track ${reverse ? "review-marquee-track-reverse" : ""}`}>
        {repeatedReviews.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export default function StudentReviewsSection() {
  const { data, isError, isLoading } = useGoogleReviews();
  const reviews = data?.reviews || [];
  const secondRowReviews = [...reviews].reverse();

  return (
    <section id="student-reviews" className="scroll-mt-28 space-y-8 py-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-600">
          Student Success Stories
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          What Our Students Say
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Real feedback from learners and families, presented in a smooth moving wall of trust.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-3xl bg-white/75 shadow-sm" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-rose-100 bg-rose-50/85 p-6 text-center text-sm font-semibold text-rose-700 shadow-sm">
          Google reviews could not be loaded right now. Please check the backend Google Places configuration.
        </div>
      ) : null}

      {!isLoading && !isError && reviews.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 text-center text-sm font-semibold text-slate-600 shadow-sm">
          No Google reviews are available yet.
        </div>
      ) : null}

      {!isLoading && !isError && reviews.length > 0 ? (
        <div className="space-y-5">
          <ReviewMarqueeRow reviews={reviews} reverse />
          <ReviewMarqueeRow reviews={secondRowReviews} />
        </div>
      ) : null}
    </section>
  );
}
