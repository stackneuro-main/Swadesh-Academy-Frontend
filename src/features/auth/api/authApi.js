import { apiClient } from "../../../lib/apiClient";

export function googleLogin(token) {
  return apiClient("/auth/google", {
    method: "POST",
    body: { token },
  });
}

export function getMyProfile() {
  return apiClient("/user/profile");
}

export function updateMyProfile(payload) {
  return apiClient("/user/profile", {
    method: "PUT",
    body: payload,
  });
}
