export function slugifyCourseTitle(title) {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCoursePath(course) {
  const slug = slugifyCourseTitle(course?.title);
  return `/courses/${slug || course?.id}`;
}

export function matchesCourseIdentifier(course, identifier) {
  if (!course || !identifier) {
    return false;
  }

  return String(course.id) === String(identifier) || slugifyCourseTitle(course.title) === identifier;
}
