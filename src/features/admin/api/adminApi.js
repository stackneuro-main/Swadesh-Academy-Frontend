import { apiClient } from "../../../lib/apiClient";

export function getAdminTeachers() {
  return apiClient("/admin/teachers");
}

export function createAdminTeacher(payload) {
  return apiClient("/admin/teachers", {
    method: "POST",
    body: payload,
  });
}

export function updateAdminTeacher(teacherId, payload) {
  return apiClient(`/admin/teachers/${teacherId}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteAdminTeacher(teacherId) {
  return apiClient(`/admin/teachers/${teacherId}`, {
    method: "DELETE",
  });
}

export function getAdminCourses() {
  return apiClient("/admin/courses");
}

export function createAdminCourse(payload) {
  return apiClient("/admin/courses", {
    method: "POST",
    body: payload,
  });
}

export function updateAdminCourse(courseId, payload) {
  return apiClient(`/admin/courses/${courseId}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteAdminCourse(courseId) {
  return apiClient(`/admin/courses/${courseId}`, {
    method: "DELETE",
  });
}

export function getAdminCourseCategories() {
  return apiClient("/admin/course-categories");
}

export function createAdminCourseCategory(payload) {
  return apiClient("/admin/course-categories", {
    method: "POST",
    body: payload,
  });
}

export function updateAdminCourseCategory(categoryId, payload) {
  return apiClient(`/admin/course-categories/${categoryId}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteAdminCourseCategory(categoryId) {
  return apiClient(`/admin/course-categories/${categoryId}`, {
    method: "DELETE",
  });
}

export function getAdminUsers() {
  return apiClient("/admin/users");
}

export function updateAdminUserRole(userId, role) {
  return apiClient(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: { role },
  });
}

export function getAdminEnrollments() {
  return apiClient("/admin/enrollments");
}

export function getAdminEnrollmentRequests() {
  return apiClient("/admin/enrollment-requests");
}

export function updateAdminEnrollmentRequestStatus(requestId, status) {
  return apiClient(`/admin/enrollment-requests/${requestId}`, {
    method: "PATCH",
    body: { status },
  });
}

export function assignAdminEnrollmentRequest(requestId, courseId) {
  return apiClient(`/admin/enrollment-requests/${requestId}/assign`, {
    method: "POST",
    body: { course_id: courseId },
  });
}

export function getAdminPayments() {
  return apiClient("/admin/payments");
}
