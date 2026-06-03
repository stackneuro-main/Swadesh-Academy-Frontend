import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Send, UserRound } from "lucide-react";

import FeedbackMessage from "../components/ui/FeedbackMessage";
import LoadingState from "../components/ui/LoadingState";
import { useCourses } from "../features/courses/hooks/useCourses";
import { createEnrollmentRequest } from "../features/enrollments/api/enrollmentApi";

const inputClasses =
  "h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export default function Enroll() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const { data: courses = [], isLoading, isError, error } = useCourses("all");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const selectedCourse = useMemo(
    () => courses.find((course) => String(course.id) === String(courseId)),
    [courseId, courses],
  );

  const requestMutation = useMutation({
    mutationFn: createEnrollmentRequest,
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedCourse) {
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      requestMutation.reset();
      return;
    }

    requestMutation.mutate({
      ...form,
      phone: form.phone.trim(),
      email: form.email.trim(),
      full_name: form.full_name.trim(),
      course_id: selectedCourse.id,
    });
  }

  if (isLoading) {
    return <LoadingState label="Preparing enrollment request..." />;
  }

  if (isError) {
    return <FeedbackMessage type="error" message={error?.message || "Unable to load course details."} />;
  }

  if (!selectedCourse) {
    return (
      <section className="mx-auto max-w-3xl rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="font-heading text-3xl font-bold text-slate-950">Choose a course first</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enrollment requests are linked to a specific course so our team can contact you with the right batch details.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
        >
          <ArrowLeft size={17} />
          Browse Courses
        </Link>
      </section>
    );
  }

  const isSubmitted = requestMutation.isSuccess;

  return (
    <section className="mx-auto max-w-5xl">
      <Link to={`/courses/${selectedCourse.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
        <ArrowLeft size={17} />
        Back to course
      </Link>

      <div className="mt-5 grid overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.1)] lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-7 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-100">Enrollment Request</p>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight">
            {selectedCourse.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-blue-50">
            Submit your details and the Swadesh Academy team will contact you with batch timing, mentorship details,
            and next steps.
          </p>
          <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Selected Course</p>
            <p className="mt-2 text-lg font-bold">{selectedCourse.title}</p>
            <p className="mt-1 text-sm text-blue-100">{selectedCourse.duration} • {selectedCourse.level}</p>
          </div>
        </aside>

        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <CheckCircle2 size={56} className="text-emerald-600" />
              <h2 className="mt-5 font-heading text-3xl font-bold text-slate-950">Request Submitted</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                Your enrollment request has been saved. Our team will contact you soon.
              </p>
              <Link
                to="/courses"
                className="mt-7 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Explore more courses
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">Student Details</p>
                <h2 className="mt-2 font-heading text-3xl font-bold text-slate-950">Request a callback</h2>
              </div>

              {requestMutation.isError ? (
                <FeedbackMessage type="error" message={requestMutation.error?.message || "Unable to submit request."} />
              ) : null}

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Full Name
                <div className="relative">
                  <UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={updateField}
                    required
                    className={`${inputClasses} pl-11`}
                    placeholder="Enter full name"
                  />
                </div>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Email Address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  className={inputClasses}
                  placeholder="student@example.com"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Phone Number
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  required
                  minLength={10}
                  pattern="[0-9+\-\s()]{10,15}"
                  className={inputClasses}
                  placeholder="Enter phone number"
                />
                <span className="text-xs font-medium text-slate-400">
                  Use a valid phone number with 10 to 15 digits.
                </span>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Course Name
                <input value={selectedCourse.title} readOnly className={`${inputClasses} bg-slate-50 font-semibold`} />
              </label>

              <button
                type="submit"
                disabled={requestMutation.isPending}
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 text-sm font-bold text-white shadow-[0_18px_36px_rgba(37,99,235,0.24)] transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {requestMutation.isPending ? "Submitting..." : "Submit Enrollment Request"}
                <Send size={17} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
