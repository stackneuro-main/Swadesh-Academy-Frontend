import { ArrowRight, PhoneCall, UsersRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { scrollToSection } from "../utils/scrollToSection";

const studentTrustStats = {
  totalStudents: "500+",
  label: "Students Benefited From Our Programs",
  description:
    "A growing learner community trusting Swadesh Academy for practical software education, mentorship, and project-first outcomes.",
};

export default function StudentTrustSection() {
  const navigate = useNavigate();

  function handleCallbackClick() {
    navigate("/#contact");
    window.setTimeout(() => scrollToSection("contact"), 80);
  }

  return (
    <section className="rounded-[2rem] border border-slate-200/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            <UsersRound size={14} />
            Student Trust
          </div>
          <h2 className="mt-5 text-3xl font-heading font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            <span className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 bg-clip-text text-transparent">
              {studentTrustStats.totalStudents}
            </span>{" "}
            {studentTrustStats.label}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {studentTrustStats.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <NavLink
            to="/Courses"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#2563eb,#06b6d4)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(6,182,212,0.32)]"
          >
            Enroll Now
            <ArrowRight size={16} />
          </NavLink>
          <button
            type="button"
            onClick={handleCallbackClick}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:text-orange-600 hover:shadow-[0_20px_45px_rgba(249,115,22,0.18)]"
          >
            Request a Call Back
            <PhoneCall size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
