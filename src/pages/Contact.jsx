import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import FeedbackMessage from "../components/ui/FeedbackMessage";
import { useCourses } from "../features/courses/hooks/useCourses";
import { submitInquiry } from "../features/inquiries/api/inquiryApi";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  courseId: "",
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const preselectedCourseId = searchParams.get("courseId") || "";
  const { data: courses = [] } = useCourses("all");
  const [form, setForm] = useState({
    ...initialFormState,
    courseId: preselectedCourseId,
  });

  const selectedCourse = useMemo(
    () => courses.find((course) => String(course.id) === String(form.courseId)),
    [courses, form.courseId]
  );

  const mutation = useMutation({
    mutationFn: submitInquiry,
    onSuccess: () => {
      setForm({
        ...initialFormState,
        courseId: preselectedCourseId,
      });
    },
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    mutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      course_id: form.courseId ? Number(form.courseId) : null,
    });
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-100">
          Contact & Inquiry
        </p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
          More information required ? write to us your query
        </h1>
        <p className="mt-4 max-w-xl text-sm text-blue-100 sm:text-base">
         Share your queries, suggestions, or feedback with us. Your valuable input helps us improve and enhance the learning experience at Swadesh Academy.
        </p>

        <div className="mt-8 space-y-4 rounded-3xl bg-white/10 p-6 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-100">
              Selected Course
            </p>
            <p className="mt-2 text-lg font-semibold">
              {selectedCourse?.title || "You can choose any course from the form"}
            </p>
          </div>
          <div>
            {/* <p className="text-xs uppercase tracking-[0.25em] text-blue-100">
              Why this matters
            </p> */}
            {/* <p className="mt-2 text-sm text-blue-50">
              You now have a production-style POST flow with validation, loading
              state, success state, and server-side persistence support.
            </p> */}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-lg sm:p-8">
        <div className="grid gap-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="courseId" className="mb-2 block text-sm font-semibold text-slate-700">
              Interested Course
            </label>
            <select
              id="courseId"
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
            >
              <option value="">General inquiry</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Tell us about your learning goal or the course you want to join"
            />
          </div>

          <FeedbackMessage
            type="error"
            message={mutation.isError ? mutation.error.message : ""}
          />
          <FeedbackMessage
            type="success"
            message={mutation.isSuccess ? "Inquiry submitted successfully." : ""}
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mutation.isPending ? "Submitting..." : "Submit Inquiry"}
          </button>
        </div>
      </form>
    </section>
  );
}
