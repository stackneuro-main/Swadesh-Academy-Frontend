import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import AuthPrompt from "../features/auth/components/AuthPrompt";
import EmptyState from "../components/ui/EmptyState";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import LoadingState from "../components/ui/LoadingState";
import { useAuth } from "../features/auth/useAuth";
import { updateMyProfile } from "../features/auth/api/authApi";
import { getMyEnrollments } from "../features/enrollments/api/enrollmentApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
};

export default function Profile() {
  const { isAuthenticated, isAuthLoading, refreshProfile, signOut, user } = useAuth();
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
    });
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      refreshProfile();
    },
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getMyEnrollments,
    enabled: isAuthenticated,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateProfileMutation.mutate(form);
  }

  if (isAuthLoading) {
    return <LoadingState label="Loading your profile..." />;
  }

  if (!isAuthenticated) {
    return (
      <AuthPrompt
        title="Profile access requires sign in"
        description="Sign in with Google to view your profile, update your details, and access your enrolled courses."
      />
    );
  }

  const enrolledCourses = enrollmentsQuery.data?.enrollments || [];

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 px-6 py-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Profile Section</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Manage your learning profile</h1>
        <p className="mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
          Update your name, mobile number, email, and city, then review every course you have successfully enrolled in.
        </p>
        <div className="mt-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
          Current role: {user?.role || "student"}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-lg sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Profile details</h2>
              <p className="mt-2 text-sm text-slate-600">
                Keep your contact details up to date for course communication.
              </p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign out
            </button>
          </div>

          <div className="mt-6 grid gap-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

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
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
                  Mobile
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-semibold text-slate-700">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>
            </div>

            <FeedbackMessage
              type="error"
              message={updateProfileMutation.isError ? updateProfileMutation.error.message : ""}
            />
            <FeedbackMessage
              type="success"
              message={updateProfileMutation.isSuccess ? "Profile updated successfully." : ""}
            />

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </form>

        <div className="rounded-[2rem] bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Enrolled courses</h2>
          <p className="mt-2 text-sm text-slate-600">
            These are the courses confirmed in your profile after successful payment.
          </p>

          <div className="mt-6">
            {enrollmentsQuery.isLoading ? <LoadingState label="Loading enrolled courses..." /> : null}
            {enrollmentsQuery.isError ? (
              <FeedbackMessage type="error" message={enrollmentsQuery.error.message} />
            ) : null}
            {!enrollmentsQuery.isLoading && !enrollmentsQuery.isError && enrolledCourses.length === 0 ? (
              <EmptyState
                title="No enrolled courses yet"
                description="Once a payment succeeds, your enrolled courses will appear here."
              />
            ) : null}

            {!enrollmentsQuery.isLoading && !enrollmentsQuery.isError && enrolledCourses.length > 0 ? (
              <div className="grid gap-4">
                {enrolledCourses.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{item.course.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.course.short_description || item.course.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p>Start Date: {new Date(item.course.start_date).toLocaleDateString("en-IN")}</p>
                      <p>Teacher: {item.course.teacher?.name || "Faculty assigned soon"}</p>
                      <p>Course Type: {item.course.course_type}</p>
                      <p>Enrolled On: {new Date(item.enrolled_at).toLocaleDateString("en-IN")}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
