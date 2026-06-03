import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useAnimation } from "motion/react";
import { useInView } from "react-intersection-observer";

import CourseList from "./CourseList";
import { useCourses } from "../features/courses/hooks/useCourses";

export default function CoursecardSection({
  type,
  activeType,
  onTypeChange,
  filterOptions = [],
  showCatalogLink = true,
}) {
  const MotionDiv = motion.div;
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: courses = [], isLoading, isError, error } = useCourses(type);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section ref={ref} className="space-y-6">
      <div className="flex flex-col gap-5 rounded-[1.6rem] border border-blue-100 bg-white/90 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.07)] backdrop-blur sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Courses
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onTypeChange?.(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                  activeType === option.value
                    ? "bg-blue-700 text-white shadow-[0_12px_28px_rgba(37,99,235,0.26)]"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {showCatalogLink ? (
          <NavLink
            to="/courses"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-700 hover:text-white"
          >
            Explore all course catalog
            <ArrowRight size={17} />
          </NavLink>
        ) : null}
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 32 }}
        animate={controls}
        variants={{
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: "easeOut" },
          },
        }}
      >
        <CourseList courses={courses} isLoading={isLoading} isError={isError} error={error} />
      </MotionDiv>
    </section>
  );
}
