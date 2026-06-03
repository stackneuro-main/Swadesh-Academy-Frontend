import { apiClient } from "../../../lib/apiClient";

export function submitStudentFeedback(feedback) {
  return apiClient("/feedback/student", {
    method: "POST",
    body: feedback,
  });
}
