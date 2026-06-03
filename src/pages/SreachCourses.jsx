import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import CourseCard from "../components/CourseCard";
import EmptyState from "../components/ui/EmptyState";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import LoadingState from "../components/ui/LoadingState";
import { useCourseSearch } from "../features/courses/hooks/useCourses";

export default function SreachCourses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTitle = searchParams.get("title") || "";
  const [title, setTitle] = useState(initialTitle);
  const [submittedTitle, setSubmittedTitle] = useState(initialTitle);

  const { data, isLoading, isError, error, isFetching } = useCourseSearch(
    submittedTitle,
    Boolean(submittedTitle)
  );

  function handleSubmit(event) {
    event.preventDefault();
    const value = title.trim();
    setSubmittedTitle(value);
    setSearchParams(value ? { title: value } : {});
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-white p-6 shadow-lg sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Course Search</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Search courses by title</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          This page demonstrates a real GET request using the FastAPI search endpoint.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
            placeholder="Search by course title"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            {isFetching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {!submittedTitle ? (
        <EmptyState
          title="Start with a course name"
          description="Try searching for a course that exists in your database, like Full Stack or Python."
        />
      ) : null}

      {isLoading ? <LoadingState label="Searching from the backend..." /> : null}
      {isError ? <FeedbackMessage type="error" message={error.message} /> : null}

      {!isLoading && !isError && data ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <CourseCard courseinfo={data} />
        </div>
      ) : null}
    </section>
  );
}
