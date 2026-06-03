import { apiClient } from "../../../lib/apiClient";

export function startCheckout(courseId) {
  return apiClient("/payments/checkout", {
    method: "POST",
    body: { course_id: courseId },
  });
}

export function completeCheckout(paymentId, result) {
  return apiClient(`/payments/${paymentId}/complete`, {
    method: "POST",
    body: { result },
  });
}
