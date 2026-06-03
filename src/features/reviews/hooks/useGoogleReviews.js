import { useQuery } from "@tanstack/react-query";

import { getGoogleReviews } from "../api/reviewApi";

export function useGoogleReviews() {
  return useQuery({
    queryKey: ["google-reviews"],
    queryFn: getGoogleReviews,
    staleTime: 1000 * 60 * 30,
  });
}
