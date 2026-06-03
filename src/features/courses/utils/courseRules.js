function toStartOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(value, days) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

export function getEnrollmentWindowState(course) {
  const today = toStartOfDay(new Date());
  const startDate = toStartOfDay(course.start_date);

  if (course.course_type === "ongoing") {
    const lastEligibleDate = addDays(startDate, 30);
    if (today > lastEligibleDate) {
      return {
        allowed: false,
        reason: "Enrollment period expired for this course.",
      };
    }
  }

  if (course.course_type === "upcoming" && today >= startDate) {
    return {
      allowed: false,
      reason: "Course already started.",
    };
  }

  return {
    allowed: true,
    reason: "",
  };
}
