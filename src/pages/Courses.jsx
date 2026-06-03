import { useEffect, useMemo, useState } from "react";
import {
  Atom,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Braces,
  CalendarDays,
  ChartColumnBig,
  Clock3,
  Coffee,
  Filter,
  Grid2X2,
  Layers3,
  Leaf,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";

import CourseCard from "../components/CourseCard";
import EmptyState from "../components/ui/EmptyState";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import { getCourses } from "../features/courses/api/courseApi";

const categoryOptions = [
  "Artificial Intelligence",
  "Web Development",
  "Mobile Development",
  "Full Stack Development",
  "Java",
  "Python",
  "Generative AI",
  "Agentic AI",
  "AI / ML",
  "Data Science",
  "Software Testing",
  "Other",
];

const levelOptions = ["beginner", "intermediate", "advanced"];
const statusOptions = ["ongoing", "upcoming"];
const popularFilters = [
  { label: "Java", value: "Java", field: "category", icon: Coffee },
  { label: "Spring Boot", value: "Spring Boot", field: "search", icon: Leaf },
  { label: "React JS", value: "React JS", field: "search", icon: Atom },
  { label: "Python", value: "Python", field: "category", icon: Braces },
  { label: "Data Science", value: "Data Science", field: "search", icon: ChartColumnBig },
  { label: "AI & ML", value: "Artificial Intelligence", field: "category", icon: BrainCircuit },
];

function CourseGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-[500px] animate-pulse rounded-[10px] border border-slate-200 bg-white shadow-sm" />
      ))}
    </div>
  );
}

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function getCourseSearchText(course) {
  return [
    course.title,
    course.short_description,
    course.description,
    course.category?.name,
    course.teacher?.name,
    course.level,
    course.course_type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    level: "all",
    status: "all",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      setIsLoading(true);
      setError(null);

      try {
        const payload = await getCourses("all");
        if (isMounted) {
          setCourses(Array.isArray(payload) ? payload : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
          setCourses([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    const search = normalize(filters.search);

    return courses.filter((course) => {
      const categoryName = normalize(course.category?.name);
      const title = normalize(course.title);
      const matchesSearch = !search || getCourseSearchText(course).includes(search);
      const matchesCategory =
        filters.category === "all" ||
        categoryName.includes(normalize(filters.category)) ||
        title.includes(normalize(filters.category));
      const matchesLevel = filters.level === "all" || normalize(course.level) === filters.level;
      const matchesStatus = filters.status === "all" || normalize(course.course_type) === filters.status;

      return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });
  }, [courses, filters]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
    setShowAllCourses(false);
  }

  function resetFilters() {
    setFilters({ search: "", category: "all", level: "all", status: "all" });
    setShowAllCourses(false);
  }

  const visibleCourses = showAllCourses ? filteredCourses : filteredCourses.slice(0, 3);
  const hasActiveFilters =
    filters.search || filters.category !== "all" || filters.level !== "all" || filters.status !== "all";

  const statusTabs = [
    { label: "All Courses", value: "all", icon: Grid2X2 },
    { label: "Ongoing Courses", value: "ongoing", icon: Clock3 },
    { label: "Upcoming Courses", value: "upcoming", icon: CalendarDays },
  ];

  const selectClass =
    "h-12 appearance-none rounded-xl border border-blue-200 bg-white px-4 pr-10 text-sm font-bold text-blue-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const inlineFilters = (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px_150px_170px]">
      <div className="relative">
        <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
          placeholder="Search course name, technology or category..."
          className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm font-semibold italic text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          <SlidersHorizontal size={17} />
        </span>
      </div>

      <label className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
          <Grid2X2 size={16} />
        </span>
        <select
          value={filters.category}
          onChange={(event) => updateFilter("category", event.target.value)}
          className={`${selectClass} w-full pl-11`}
          aria-label="Filter by category"
        >
          <option value="all">Category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>

      <label className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
          <Layers3 size={16} />
        </span>
        <select
          value={filters.level}
          onChange={(event) => updateFilter("level", event.target.value)}
          className={`${selectClass} w-full pl-11 capitalize`}
          aria-label="Filter by level"
        >
          <option value="all">Level</option>
          {levelOptions.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </label>

      <label className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
          <UserRound size={16} />
        </span>
        <select
          value={filters.status}
          onChange={(event) => updateFilter("status", event.target.value)}
          className={`${selectClass} w-full pl-11 capitalize`}
          aria-label="Filter by course status"
        >
          <option value="all">Batch Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <section className="space-y-8">
      <div className="rounded-[10px] border border-slate-200 bg-white p-4 shadow-[0_18px_52px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shadow-[0_12px_24px_rgba(37,99,235,0.16)]">
              <BookOpen size={27} />
            </span>
            <div>
              <h1 className="font-heading text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Course Catalog
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
                Explore our expert-led courses and take the next step in your learning journey.
              </p>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:grid-cols-3">
            {statusTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = filters.status === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => updateFilter("status", tab.value)}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition ${
                    isActive
                      ? "border border-blue-300 bg-white text-blue-700 shadow-[0_10px_24px_rgba(37,99,235,0.14)]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7 rounded-[10px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <div className="hidden lg:block">{inlineFilters}</div>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 text-sm font-black text-blue-700 lg:hidden"
          >
            <Filter size={17} />
            Search & Filters
          </button>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-bold text-slate-500">Popular:</span>
            {popularFilters.map((item) => {
              const Icon = item.icon;
              const isActive = filters[item.field] === item.value;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => updateFilter(item.field, item.value)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-black transition hover:-translate-y-0.5 ${
                    isActive
                      ? "border-blue-300 bg-blue-600 text-white shadow-[0_12px_24px_rgba(37,99,235,0.18)]"
                      : "border-slate-200 bg-slate-50 text-blue-700 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowAllCourses(true)}
              className="ml-auto inline-flex items-center gap-2 px-2 py-2 text-sm font-black text-blue-700 transition hover:translate-x-1 hover:text-blue-900"
            >
              View All
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-slate-700">
            {isLoading ? "Fetching live courses..." : `${filteredCourses.length} course${filteredCourses.length === 1 ? "" : "s"} found`}
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 transition hover:bg-slate-100"
              >
                Reset filters
              </button>
            ) : null}
            {!showAllCourses && filteredCourses.length > 3 ? (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">Previewing 3 courses</span>
            ) : null}
          </div>
        </div>

        {isLoading ? <CourseGridSkeleton /> : null}

        {error ? (
          <FeedbackMessage type="error" message={error?.message || "Unable to load courses right now."} />
        ) : null}

        {!isLoading && !error && filteredCourses.length === 0 ? (
          <EmptyState
            title="No courses found"
            description={courses.length ? "Try changing your search or filters." : "Once active courses are added, they will appear here."}
          />
        ) : null}

        {!isLoading && !error && visibleCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleCourses.map((course) => (
              <CourseCard key={course.id} courseinfo={course} />
            ))}
          </div>
        ) : null}

        {!isLoading && !error && !showAllCourses && filteredCourses.length > 3 ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowAllCourses(true)}
              className="inline-flex items-center gap-2 pr-1 text-2xl font-semibold italic text-slate-950 transition hover:translate-x-1 hover:text-blue-700"
            >
              See all
              <span className="text-3xl leading-none">&gt;&gt;</span>
            </button>
          </div>
        ) : null}
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[80] bg-slate-950/45 backdrop-blur-sm lg:hidden">
          <div className="ml-auto flex h-full w-full max-w-sm flex-col bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-heading text-xl font-bold text-slate-950">Filters</p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-600"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            {inlineFilters}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-auto min-h-12 rounded-2xl bg-blue-700 px-5 text-sm font-bold text-white"
            >
              Show Courses
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
