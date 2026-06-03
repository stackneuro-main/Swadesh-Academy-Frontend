import { API_BASE_URL } from "../config/env";
import { getStoredAuthToken } from "../features/auth/utils/authStorage";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload?.detail
        ? payload.detail
        : "Something went wrong while talking to the server.";
    throw new Error(message);
  }

  return payload;
}

export async function apiClient(path, options = {}) {
  const { body, headers, token, ...restOptions } = options;
  const authToken = token || getStoredAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response);
}
