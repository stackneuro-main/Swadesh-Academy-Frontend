import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MessageSquareHeart, Star } from "lucide-react";

import { submitStudentFeedback } from "../features/feedback/api/feedbackApi";
import { useGoogleReviews } from "../features/reviews/hooks/useGoogleReviews";
import FeedbackMessage from "./ui/FeedbackMessage";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  course_name: "",
  rating: 0,
  feedback_message: "",
};

function GoogleMark() {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white font-heading text-base font-bold shadow-sm">
      <span className="text-blue-600">G</span>
    </span>
  );
}

export default function FeedbackSection() {
  const { data: reviewData } = useGoogleReviews();
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const writeReviewUrl = reviewData?.write_review_url;

  const mutation = useMutation({
    mutationFn: submitStudentFeedback,
    onSuccess: () => {
      setForm(initialForm);
      setFormError("");
    },
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.rating) {
      setFormError("Please select a rating before submitting your feedback.");
      return;
    }

    mutation.mutate({
      ...form,
      phone: form.phone || null,
      course_name: form.course_name || null,
    });
  }

  return (
    <section id="student-feedback" className="scroll-mt-28 space-y-6 py-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
              <MessageSquareHeart size={22} />
            </div>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
              Student Feedback
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Give Your Feedback to Swadesh Academy
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We value your feedback and continuously strive to improve the learning experience for our students.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="feedback-full-name" className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  id="feedback-full-name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="feedback-email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  id="feedback-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="feedback-phone" className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  id="feedback-phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label htmlFor="feedback-course" className="mb-2 block text-sm font-semibold text-slate-700">
                  Course Name
                </label>
                <input
                  id="feedback-course"
                  name="course_name"
                  value={form.course_name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 block text-sm font-semibold text-slate-700">Rating</p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Feedback rating">
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating = index + 1;
                  const isActive = form.rating >= rating;

                  return (
                    <button
                      key={rating}
                      type="button"
                      role="radio"
                      aria-checked={form.rating === rating}
                      onClick={() => setForm((current) => ({ ...current, rating }))}
                      className="rounded-full border border-amber-200 bg-white p-2 text-amber-400 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Star size={22} className={isActive ? "fill-amber-400" : "fill-transparent"} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="feedback-message" className="mb-2 block text-sm font-semibold text-slate-700">
                Feedback Message
              </label>
              <textarea
                id="feedback-message"
                name="feedback_message"
                value={form.feedback_message}
                onChange={handleChange}
                required
                minLength={10}
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Share your experience with Swadesh Academy"
              />
            </div>

            <FeedbackMessage type="error" message={formError || (mutation.isError ? mutation.error.message : "")} />
            <FeedbackMessage type="success" message={mutation.isSuccess ? mutation.data.message : ""} />

            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-600 via-slate-900 to-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-100">
              Leave a Review on Google
            </p>
            <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight">
              Share your learning experience publicly.
            </h3>
          </div>
          {writeReviewUrl ? (
            <a
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <GoogleMark />
              Write a Google Review
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-3 rounded-full bg-white/75 px-5 py-3 text-sm font-bold text-slate-500"
            >
              <GoogleMark />
              Write a Google Review
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
