import { apiClient } from "../../../lib/apiClient";

export function getCourses(type = "all") {
  const endpointMap = {
    all: "/course/all",
    ongoing: "/course/ongoing",
    upcoming: "/course/upcoming",
  };

  return apiClient(endpointMap[type] || endpointMap.all);
}

export function searchCourse(title) {
  return apiClient(`/course/search?title=${encodeURIComponent(title)}`);
}

export function getCourseById(courseId) {
  return apiClient(`/course/${courseId}`);
}
