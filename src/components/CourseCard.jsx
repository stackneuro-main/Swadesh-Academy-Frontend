import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  CalendarCheck2,
  CalendarDays,
  Headphones,
  PlayCircle,
  Star,
  UsersRound,
} from "lucide-react";

import { getCoursePath } from "../features/courses/utils/courseSlug";

function formatCourseDate(dateValue) {
  if (!dateValue) return "Date announcing soon";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Date announcing soon";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(dateValue));
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

function normalizeLabel(value, fallback) {
  return (value || fallback).replace(/^./, (char) => char.toUpperCase());
}

function getInitials(name) {
  return (name || "SA")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function CourseInfoTile({ icon: Icon, value, label, hasBorder = true }) {
  return (
    <div
      className={`group/tile flex min-w-0 flex-col items-center gap-0.5 px-1.5 py-2.5 transition duration-300 hover:-translate-y-1 hover:bg-blue-50 ${
        hasBorder ? "border-r border-slate-200" : ""
      }`}
    >
      <Icon size={18} className="shrink-0 text-blue-600 transition duration-300 group-hover/tile:scale-110 group-hover/tile:text-blue-700" />
      <div>
        <p className="truncate font-bold text-slate-950 transition group-hover/tile:text-blue-700">{value}</p>
        <p className="text-slate-500 transition group-hover/tile:text-slate-700">{label}</p>
      </div>
    </div>
  );
}

function BenefitTile({ icon: Icon, label, hasBorder = false }) {
  return (
    <div
      className={`group/benefit flex flex-col items-center gap-1 rounded-lg py-1.5 transition duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:text-blue-700 ${
        hasBorder ? "border-x border-slate-200" : ""
      }`}
    >
      <Icon size={18} className="text-blue-600 transition duration-300 group-hover/benefit:scale-110" />
      {label}
    </div>
  );
}

export default function CourseCard({ courseinfo }) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const navigate = useNavigate();
  const detailPath = getCoursePath(courseinfo);
  const hasDiscount =
    Number(courseinfo.discounted_price) > 0 &&
    Number(courseinfo.discounted_price) < Number(courseinfo.actual_price);
  const description = courseinfo.short_description || courseinfo.description || "";
  const canExpandDescription = description.length > 150;
  const studentCount = Number(courseinfo.student_count || 0);
  const teacher = courseinfo.teacher;
  const shouldShowBestseller =
    Boolean(courseinfo.is_bestseller || courseinfo.bestseller) || Number(courseinfo.rating || 0) >= 4.8;
  const discountLabel =
    courseinfo.savings_percentage ||
    (hasDiscount
      ? Math.round(
          ((Number(courseinfo.actual_price) - Number(courseinfo.discounted_price)) /
            Number(courseinfo.actual_price)) *
            100,
        )
      : 0);

  function openDetails() {
    navigate(detailPath);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetails();
    }
  }

  function toggleDescription(event) {
    event.preventDefault();
    event.stopPropagation();
    setDescriptionExpanded((current) => !current);
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={handleKeyDown}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)] outline-none transition duration-500 ease-out will-change-transform hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_22px_56px_rgba(37,99,235,0.16)] focus-visible:ring-4 focus-visible:ring-blue-100"
    >
      <div className="relative aspect-[16/8.5] overflow-hidden bg-slate-950">
        {courseinfo.photo ? (
          <img
            src={courseinfo.photo}
            alt={courseinfo.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_70%_62%,rgba(37,99,235,0.52),transparent_24%),radial-gradient(circle_at_88%_30%,rgba(250,204,21,0.22),transparent_18%),linear-gradient(135deg,#020617_0%,#071d49_54%,#020617_100%)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/28 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-[72%] flex-col justify-center px-5 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-yellow-300">
            {courseinfo.category?.name || "Course"}
          </p>
          <h3 className="mt-1 line-clamp-2 text-3xl font-black uppercase leading-none tracking-tight drop-shadow-lg">
            {courseinfo.title}
          </h3>
        </div>

        {shouldShowBestseller ? (
          <div className="absolute right-3 top-0 flex w-20 flex-col items-center rounded-b-2xl border-x border-b border-yellow-400/25 bg-slate-950/82 px-2 py-3 text-center text-white shadow-xl backdrop-blur">
            <Star size={19} className="fill-yellow-300 text-yellow-300" />
            <span className="mt-1 text-xs font-bold text-yellow-300">Bestseller</span>
            <span className="mt-0.5 text-[10px] leading-4 text-slate-100">Top Rated</span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <div>
          <h3 className="line-clamp-2 min-h-[3rem] font-heading text-lg font-bold leading-tight text-slate-950">
            {courseinfo.title}
          </h3>
          <p className={`mt-1.5 text-sm leading-5 text-slate-600 ${descriptionExpanded ? "" : "line-clamp-2 min-h-10"}`}>
            {description}
            {canExpandDescription ? (
              <button
                type="button"
                onClick={toggleDescription}
                className="ml-1 font-semibold text-blue-600 transition hover:text-blue-700"
              >
                {descriptionExpanded ? "see less" : "see more"}
              </button>
            ) : null}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white text-center text-[10px] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <CourseInfoTile icon={CalendarDays} value={courseinfo.duration} label="Duration" />
          <CourseInfoTile icon={UsersRound} value={studentCount ? `${studentCount}+` : "New"} label="Enrolled" />
          <CourseInfoTile icon={PlayCircle} value={normalizeLabel(courseinfo.course_type, "Upcoming")} label="Batch" />
          <CourseInfoTile icon={BarChart3} value={normalizeLabel(courseinfo.level, "Beginner")} label="Level" hasBorder={false} />
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/80 px-3 py-2.5 text-xs text-slate-900">
          <CalendarCheck2 size={18} className="shrink-0 text-blue-600" />
          <span className="shrink-0">Starts</span>
          <span className="ml-auto truncate font-bold text-blue-700">
            {formatCourseDate(courseinfo.start_date)}
          </span>
        </div>

        <div className="group/instructor mt-3 flex items-center gap-3 rounded-xl p-1.5 transition duration-300 hover:-translate-y-1 hover:bg-slate-50">
          {teacher?.photo ? (
            <img src={teacher.photo} alt={teacher.name} className="h-11 w-11 rounded-full object-cover shadow-md transition duration-300 group-hover/instructor:scale-105" />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 shadow-inner transition duration-300 group-hover/instructor:bg-blue-50 group-hover/instructor:text-blue-700">
              {getInitials(teacher?.name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-blue-600">Instructor</p>
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-bold text-slate-950 transition group-hover/instructor:text-blue-700">
                {teacher?.name || "Faculty assigned soon"}
              </p>
              <BadgeCheck size={17} className="shrink-0 fill-blue-600 text-white" />
            </div>
            <p className="truncate text-xs text-slate-500">
              {teacher?.job_title || "Swadesh Academy Instructor"}
              {teacher?.experience_years ? ` - ${teacher.experience_years}+ years of experience` : ""}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
          <div className="flex flex-wrap items-center gap-2">
            {hasDiscount ? (
              <span className="text-base font-bold text-slate-500 line-through">
                Rs.{formatPrice(courseinfo.actual_price)}
              </span>
            ) : null}
            <span className="text-2xl font-black tracking-tight text-slate-950">
              Rs.{formatPrice(courseinfo.discounted_price || courseinfo.actual_price)}
            </span>
            {hasDiscount ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                {discountLabel}% OFF
              </span>
            ) : null}
          </div>

          <NavLink
            to={`/enroll?courseId=${courseinfo.id}`}
            onClick={(event) => event.stopPropagation()}
            className="mt-2.5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white shadow-[0_14px_28px_rgba(29,78,216,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            Enroll Now
            <ArrowRight size={22} />
          </NavLink>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center text-[10px] font-semibold text-slate-700">
          <BenefitTile icon={Award} label="Certificate" />
          <BenefitTile icon={BadgeCheck} label="Projects" hasBorder />
          <BenefitTile icon={Headphones} label="Mentorship" />
        </div>
      </div>
    </article>
  );
}
