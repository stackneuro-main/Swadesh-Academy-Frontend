import { useQuery } from "@tanstack/react-query";

import { getCourseById, getCourses, searchCourse } from "../api/courseApi";

export function useCourses(type = "all") {
  return useQuery({
    queryKey: ["courses", type],
    queryFn: () => getCourses(type),
    staleTime: 0,
    retry: 1,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  });
}

export function useCourseSearch(title, enabled) {
  return useQuery({
    queryKey: ["course-search", title],
    queryFn: () => searchCourse(title),
    enabled,
    retry: false,
  });
}

export function useCourseById(courseId) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: Boolean(courseId),
    retry: false,
  });
}
