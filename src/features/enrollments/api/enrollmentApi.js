import { apiClient } from "../../../lib/apiClient";

export function getMyEnrollments() {
  return apiClient("/enroll/my");
}

export function createEnrollmentRequest(payload) {
  return apiClient("/enroll/requests", {
    method: "POST",
    body: payload,
  });
}
