import { apiClient } from "../../../lib/apiClient";

export function getSocialStats() {
  return apiClient("/social/stats");
}
