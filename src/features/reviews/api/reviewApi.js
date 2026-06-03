import { apiClient } from "../../../lib/apiClient";

export function getGoogleReviews() {
  return apiClient("/reviews/google");
}
