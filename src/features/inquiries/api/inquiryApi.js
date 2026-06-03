import { apiClient } from "../../../lib/apiClient";

export function submitInquiry(payload) {
  return apiClient("/inquiries/", {
    method: "POST",
    body: payload,
  });
}
