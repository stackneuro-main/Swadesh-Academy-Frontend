import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CourseCard from "./CourseCard";
import EmptyState from "./ui/EmptyState";
import FeedbackMessage from "./ui/FeedbackMessage";

function CourseCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
      <div className="aspect-[16/10] animate-pulse bg-slate-200" />
      <div className="space-y-4 p-4">
        <div className="space-y-3">
          <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
        <div className="h-12 animate-pulse rounded-xl bg-blue-50" />
        <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export default function CourseList({ courses = [], isLoading, isError, error }) {
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setCanScrollPrev(track.scrollLeft > 8);
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  }, []);

  const scheduleScrollButtonUpdate = useCallback(() => {
    if (rafRef.current) {
      return;
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updateScrollButtons();
    });
  }, [updateScrollButtons]);

  function scrollCarousel(direction) {
    const track = trackRef.current;
    if (!track) return;

    const slide = track.querySelector(".course-carousel-slide");
    const slideWidth = slide?.getBoundingClientRect().width || track.clientWidth;
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || "0");

    track.scrollBy({
      left: direction * (slideWidth + gap),
      behavior: "smooth",
    });
  }

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", scheduleScrollButtonUpdate, { passive: true });
    return () => {
      window.removeEventListener("resize", scheduleScrollButtonUpdate);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [courses.length, isLoading, scheduleScrollButtonUpdate, updateScrollButtons]);

  if (isLoading) {
    return (
      <div className="course-carousel-shell">
        <div className="course-carousel-track">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="course-carousel-slide">
              <CourseCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <FeedbackMessage
        type="error"
        message={error?.message || "Unable to load courses right now."}
      />
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses available"
        description="Once courses are added in the backend, they will appear here automatically."
      />
    );
  }

  return (
    <div className="course-carousel-shell">
      <button
        type="button"
        aria-label="Previous courses"
        onClick={() => scrollCarousel(-1)}
        disabled={!canScrollPrev}
        className="course-carousel-button course-carousel-button-prev"
      >
        <ChevronLeft size={22} />
      </button>

      <div
        ref={trackRef}
        onScroll={scheduleScrollButtonUpdate}
        className="course-carousel-track"
      >
        {courses.map((course) => (
          <div key={course.id} className="course-carousel-slide">
            <CourseCard courseinfo={course} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Next courses"
        onClick={() => scrollCarousel(1)}
        disabled={!canScrollNext}
        className="course-carousel-button course-carousel-button-next"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
