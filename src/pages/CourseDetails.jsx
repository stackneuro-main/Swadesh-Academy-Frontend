import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  BookOpenCheck,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileCheck2,
  GraduationCap,
  Home,
  Layers3,
  PlayCircle,
  Star,
  UserRound,
  UsersRound,
  Video,
} from "lucide-react";

import CourseCard from "../components/CourseCard";
import EmptyState from "../components/ui/EmptyState";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import LoadingState from "../components/ui/LoadingState";
import { useCourseById, useCourses } from "../features/courses/hooks/useCourses";
import { getCoursePath, matchesCourseIdentifier } from "../features/courses/utils/courseSlug";

function normalizeLabel(value, fallback = "") {
  return String(value || fallback).replace(/^./, (char) => char.toUpperCase());
}

function formatCourseDate(dateValue) {
  if (!dateValue) return "Announcing soon";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Announcing soon";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
    if (parsedUrl.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsedUrl.pathname.replace("/", "")}`;
    }
  } catch {
    return "";
  }

  return "";
}

function isDirectVideoUrl(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || "");
}

function getInitials(name) {
  return (name || "SA")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const benefitItems = [
  { label: "Live Interactive Sessions", icon: Video },
  { label: "One-on-One Mentorship", icon: UserRound },
  { label: "Hands-on Projects", icon: Code2 },
  { label: "Assignments & Quizzes", icon: ClipboardCheck },
  { label: "Certificate of Completion", icon: FileCheck2 },
  { label: "Career Guidance", icon: BarChart3 },
];

export default function CourseDetails() {
  const { courseId } = useParams();
  const numericCourseId = courseId ? Number(courseId) : null;
  const isNumericCourseId = Number.isFinite(numericCourseId);
  const courseByIdQuery = useCourseById(isNumericCourseId ? numericCourseId : null);
  const coursesQuery = useCourses("all");
  const slugCourse = coursesQuery.data?.find((item) => matchesCourseIdentifier(item, courseId));
  const course = isNumericCourseId ? courseByIdQuery.data : slugCourse;
  const isLoading = isNumericCourseId ? courseByIdQuery.isLoading : coursesQuery.isLoading;
  const isError = isNumericCourseId ? courseByIdQuery.isError : coursesQuery.isError;
  const error = isNumericCourseId ? courseByIdQuery.error : coursesQuery.error;

  if (!courseId) {
    return <EmptyState title="Course not selected" description="Open a course from the catalog to view details." />;
  }

  if (isLoading) {
    return <LoadingState label="Loading course details..." />;
  }

  if (isError) {
    return <FeedbackMessage type="error" message={error?.message || "Unable to load this course."} />;
  }

  if (!course) {
    return <EmptyState title="Course not found" description="This course is unavailable or still in draft." />;
  }

  const curriculumItems = Array.isArray(course.curriculum_items) ? course.curriculum_items : [];
  const prerequisites = Array.isArray(course.prerequisites) ? course.prerequisites : [];
  const youtubeEmbedUrl = getYouTubeEmbedUrl(course.intro_video_url);
  const allCourses = Array.isArray(coursesQuery.data) ? coursesQuery.data : [];
  const relatedCourses = allCourses
    .filter((item) => {
      if (item.id === course.id) return false;
      return item.category_id === course.category_id || item.level === course.level || item.course_type === course.course_type;
    })
    .slice(0, 3);

  return (
    <section className="w-full max-w-full overflow-x-hidden space-y-6">
      <div className="w-full max-w-full overflow-hidden rounded-[1.35rem] border border-slate-800/40 bg-[radial-gradient(circle_at_72%_32%,rgba(37,99,235,0.36),transparent_24%),linear-gradient(135deg,#020617_0%,#071737_52%,#111027_100%)] p-4 text-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:rounded-[1.75rem] sm:p-7">
        <div className="flex max-w-full flex-wrap items-center gap-3 text-sm text-slate-300">
          <Link to="/" className="inline-flex items-center gap-2 transition hover:text-white">
            <Home size={17} />
            Home
          </Link>
          <span>/</span>
          <Link to="/courses" className="transition hover:text-white">Courses</Link>
          <span>/</span>
          <span className="min-w-0 break-words text-white">{course.title}</span>
        </div>

        <div className="mt-7 grid w-full max-w-full min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="min-w-0 max-w-full">
            <span className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-[0_12px_28px_rgba(37,99,235,0.3)]">
              {course.category?.name || "Course"}
            </span>
            <h1 className="mt-5 max-w-4xl font-heading text-3xl font-black leading-tight tracking-tight sm:text-5xl xl:text-6xl">
              {course.title}
            </h1>
            <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-200 sm:text-base sm:leading-8">
              {course.short_description || course.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-200 sm:gap-4">
              <span className="inline-flex items-center gap-2">
                <Star size={18} className="fill-amber-300 text-amber-300" />
                {Number(course.rating || 4.8).toFixed(1)} Rating
              </span>
              <span className="h-5 w-px bg-white/15" />
              <span className="inline-flex items-center gap-2">
                <UsersRound size={18} className="text-blue-300" />
                {Number(course.student_count || 0) ? `${course.student_count}+` : "New"} Students
              </span>
              <span className="h-5 w-px bg-white/15" />
              <span className="inline-flex items-center gap-2">
                <Layers3 size={18} className="text-blue-300" />
                {normalizeLabel(course.level, "Beginner")} Level
              </span>
            </div>

            <div className="mt-8 grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-white/8 text-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Duration", value: course.duration, icon: CalendarCheck2 },
                { label: "Start Date", value: formatCourseDate(course.start_date), icon: CalendarDays },
                { label: "Batch", value: normalizeLabel(course.course_type, "Upcoming"), icon: BookOpenCheck },
                { label: "Level", value: normalizeLabel(course.level, "Beginner"), icon: BarChart3 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="group/stat flex min-w-0 items-center gap-3 border-b border-white/10 p-4 transition duration-300 last:border-b-0 hover:-translate-y-1 hover:bg-white/12 hover:shadow-[0_18px_42px_rgba(37,99,235,0.18)] sm:border-b sm:border-r sm:last:border-b sm:even:border-r-0 lg:border-b-0 lg:even:border-r lg:last:border-r-0"
                  >
                    <Icon size={24} className="shrink-0 text-blue-300 transition duration-300 group-hover/stat:scale-110 group-hover/stat:text-cyan-200" />
                    <div className="min-w-0">
                      <p className="break-words text-lg font-bold leading-tight text-white transition group-hover/stat:text-cyan-100 sm:text-xl">{item.value}</p>
                      <p className="text-slate-300 transition group-hover/stat:text-white">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="w-full max-w-full min-w-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/8 p-4 backdrop-blur sm:rounded-[1.5rem] xl:self-start">
            <div className="w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
              {youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={`${course.title} preview`}
                  className="aspect-video w-full max-w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isDirectVideoUrl(course.intro_video_url) ? (
                <video src={course.intro_video_url} controls className="aspect-video w-full max-w-full bg-black" />
              ) : course.photo || course.banner_photo ? (
                <img src={course.banner_photo || course.photo} alt={course.title} className="aspect-video w-full max-w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.45),transparent_28%),#020617]">
                  <PlayCircle size={44} className="text-blue-200" />
                </div>
              )}
            </div>

            <div className="mt-5 flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
              {course.teacher?.photo ? (
                <img src={course.teacher.photo} alt={course.teacher.name} className="h-14 w-14 shrink-0 rounded-full object-cover ring-4 ring-white/10 sm:h-16 sm:w-16" />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-base font-bold sm:h-16 sm:w-16 sm:text-lg">
                  {getInitials(course.teacher?.name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-300">Instructor</p>
                <div className="flex items-center gap-2">
                  <h2 className="min-w-0 break-words text-lg font-bold leading-tight sm:text-xl">{course.teacher?.name || "Swadesh Academy Instructor"}</h2>
                  <BadgeCheck size={19} className="shrink-0 fill-blue-500 text-white" />
                </div>
                <p className="mt-1 break-words text-sm text-slate-300">
                  {course.teacher?.job_title || "Faculty"} - {course.teacher?.experience_years || 0}+ years of experience
                </p>
              </div>
            </div>

            <Link
              to={`/enroll?courseId=${course.id}`}
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-5 text-base font-black text-white shadow-[0_18px_42px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Enroll Now
              <ArrowRight size={22} />
            </Link>
          </aside>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          <section className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[1.5rem] sm:p-6">
            <div className="flex items-center gap-3">
              <BookOpen size={26} className="text-blue-700" />
              <h2 className="font-heading text-2xl font-bold text-slate-950">Course Description</h2>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{course.description}</p>

            <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6">
              <GraduationCap size={24} className="text-blue-700" />
              <h3 className="font-heading text-xl font-bold text-slate-950">Course Curriculum</h3>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(curriculumItems.length ? curriculumItems : [
                "Strong fundamentals and practical workflows",
                "Project-oriented learning with mentor support",
                "Career-focused guidance and interview preparation",
                "Certificate-ready completion structure",
              ]).map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="group/curriculum flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900 hover:shadow-[0_16px_34px_rgba(37,99,235,0.12)]"
                >
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600 transition duration-300 group-hover/curriculum:scale-110 group-hover/curriculum:text-blue-700" />
                  <span className="transition group-hover/curriculum:translate-x-0.5">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[1.5rem] sm:p-6 xl:self-start">
          <h2 className="font-heading text-2xl font-bold text-slate-950">This Course Includes</h2>
          <div className="mt-5 grid gap-4">
            {benefitItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group/include flex items-center gap-3 rounded-2xl border border-transparent p-2 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-800 hover:shadow-[0_14px_30px_rgba(37,99,235,0.1)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition duration-300 group-hover/include:scale-110 group-hover/include:bg-white group-hover/include:text-blue-800">
                    <Icon size={18} />
                  </span>
                  {item.label}
                </div>
              );
            })}
          </div>

          <div className="mt-7 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-3">
              <GraduationCap size={24} className="text-blue-700" />
              <h2 className="font-heading text-2xl font-bold text-slate-950">Prerequisites</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {(prerequisites.length ? prerequisites : ["A willingness to learn", "Basic computer knowledge"]).map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="group/prereq flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:text-blue-900 hover:shadow-[0_12px_28px_rgba(37,99,235,0.1)]"
                >
                  <BookOpenCheck size={18} className="mt-0.5 shrink-0 text-blue-700 transition duration-300 group-hover/prereq:scale-110" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[1.5rem] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">Related Courses</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-950">Other similar courses</h2>
          </div>
          <Link to="/courses" className="text-sm font-bold text-blue-700 transition hover:text-blue-900">
            View catalog
          </Link>
        </div>

        {relatedCourses.length ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedCourses.map((item) => (
              <CourseCard key={item.id} courseinfo={item} />
            ))}
          </div>
        ) : (
          <EmptyState title="No related courses yet" description="More related courses will appear as the catalog grows." />
        )}
      </section>
    </section>
  );
}
