import { apiClient } from "../../../lib/apiClient";

function normalizeCourseList(payload) {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.courses)) return payload.courses;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;

  return [];
}

export function getCourses(type = "all") {
  const endpointMap = {
    all: "/course/all",
    ongoing: "/course/ongoing",
    upcoming: "/course/upcoming",
  };

  return apiClient(endpointMap[type] || endpointMap.all).then(normalizeCourseList);
}

export function searchCourse(title) {
  return apiClient(`/course/search?title=${encodeURIComponent(title)}`).then(normalizeCourseList);
}

export function getCourseById(courseId) {
  return apiClient(`/course/${courseId}`);
}
