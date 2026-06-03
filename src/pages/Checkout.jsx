import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

import AuthPrompt from "../features/auth/components/AuthPrompt";
import { useAuth } from "../features/auth/useAuth";
import EmptyState from "../components/ui/EmptyState";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import LoadingState from "../components/ui/LoadingState";
import { useCourseById } from "../features/courses/hooks/useCourses";
import { getEnrollmentWindowState } from "../features/courses/utils/courseRules";
import { completeCheckout, startCheckout } from "../features/payments/api/paymentApi";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const numericCourseId = courseId ? Number(courseId) : null;
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [paymentSession, setPaymentSession] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  const courseQuery = useCourseById(numericCourseId);
  const course = courseQuery.data;
  const localWindowState = useMemo(
    () => (course ? getEnrollmentWindowState(course) : { allowed: true, reason: "" }),
    [course]
  );

  const checkoutMutation = useMutation({
    mutationFn: startCheckout,
    onSuccess: (data) => {
      setPaymentSession(data);
      setPaymentMessage("");
    },
  });

  const paymentResultMutation = useMutation({
    mutationFn: ({ paymentId, result }) => completeCheckout(paymentId, result),
    onSuccess: (data) => {
      setPaymentMessage(data.message);

      if (data.payment.status === "failed") {
        setPaymentSession(null);
        return;
      }

      setPaymentSession(data.payment);
    },
  });

  function handleStartPayment() {
    if (!numericCourseId) {
      return;
    }

    checkoutMutation.mutate(numericCourseId);
  }

  function handlePaymentResult(result) {
    if (!paymentSession) {
      return;
    }

    paymentResultMutation.mutate({
      paymentId: paymentSession.id,
      result,
    });
  }

  if (!numericCourseId) {
    return (
      <EmptyState
        title="Course not selected"
        description="Choose a course first, then come back to checkout."
      />
    );
  }

  if (courseQuery.isLoading || isAuthLoading) {
    return <LoadingState label="Preparing your checkout..." />;
  }

  if (courseQuery.isError) {
    return <FeedbackMessage type="error" message={courseQuery.error.message} />;
  }

  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        description="The selected course could not be loaded from the backend."
      />
    );
  }

  if (course.course_type === "ongoing" && !localWindowState.allowed) {
    return (
      <section className="rounded-[2rem] bg-white p-8 shadow-lg">
        <FeedbackMessage type="error" message={localWindowState.reason} />
        <div className="mt-6">
          <Link
            to="/Courses"
            className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            Back to courses
          </Link>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthPrompt
        title="Sign in before enrollment"
        description="Use Google Sign-In to continue with the course enrollment and payment flow."
      />
    );
  }

  const isPaymentSuccessful = paymentSession?.status === "success";

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 px-6 py-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Enrollment Checkout</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Complete your enrollment</h1>
        <p className="mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
          This phase uses a mock payment gateway that matches the architecture flow before a real payment provider is connected.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">{course.title}</h2>
          <p className="mt-3 text-sm text-slate-600">
            {course.short_description || course.description}
          </p>

          <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
            <p>Course Type: {course.course_type}</p>
            <p>Actual Price: Rs. {Number(course.actual_price).toLocaleString("en-IN")}</p>
            <p>Discounted Price: Rs. {Number(course.discounted_price).toLocaleString("en-IN")}</p>
            <p>Start Date: {new Date(course.start_date).toLocaleDateString("en-IN")}</p>
            <p>Teacher: {course.teacher?.name || "Faculty assigned soon"}</p>
            <p>You Save: {course.savings_percentage}%</p>
          </div>

          {course.course_type === "upcoming" && !localWindowState.allowed ? (
            <div className="mt-6">
              <FeedbackMessage type="error" message={localWindowState.reason} />
            </div>
          ) : null}

          <div className="mt-6">
            <FeedbackMessage
              type="error"
              message={checkoutMutation.isError ? checkoutMutation.error.message : ""}
            />
            <FeedbackMessage
              type="error"
              message={paymentResultMutation.isError ? paymentResultMutation.error.message : ""}
            />
            <FeedbackMessage
              type={isPaymentSuccessful ? "success" : "info"}
              message={paymentMessage}
            />
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-lg sm:p-8">
          {!paymentSession ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900">Proceed to payment</h2>
              <p className="mt-3 text-sm text-slate-600">
                Start a checkout session to simulate the payment gateway in phase 1.
              </p>
              <button
                type="button"
                onClick={handleStartPayment}
                disabled={checkoutMutation.isPending || !localWindowState.allowed}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checkoutMutation.isPending ? "Creating payment session..." : "Proceed to Payment"}
              </button>
            </>
          ) : null}

          {paymentSession && !isPaymentSuccessful ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900">Payment gateway</h2>
              <p className="mt-3 text-sm text-slate-600">
                This mock gateway lets us complete the first-phase architecture before integrating a live provider.
              </p>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p>Payment ID: {paymentSession.id}</p>
                <p className="mt-2">Amount: Rs. {Number(paymentSession.amount).toLocaleString("en-IN")}</p>
                <p className="mt-2 uppercase">Status: {paymentSession.status}</p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handlePaymentResult("success")}
                  disabled={paymentResultMutation.isPending}
                  className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {paymentResultMutation.isPending ? "Processing..." : "Mark Payment Success"}
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentResult("failed")}
                  disabled={paymentResultMutation.isPending}
                  className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {paymentResultMutation.isPending ? "Processing..." : "Mark Payment Failed"}
                </button>
              </div>
            </>
          ) : null}

          {isPaymentSuccessful ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900">Enrollment confirmed</h2>
              <p className="mt-3 text-sm text-slate-600">
                Your course was added to the profile section after payment success, matching the phase-1 architecture.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/profile"
                  className="inline-flex justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
                >
                  View Enrolled Courses
                </Link>
                <Link
                  to="/Courses"
                  className="inline-flex justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Back to Course List
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
