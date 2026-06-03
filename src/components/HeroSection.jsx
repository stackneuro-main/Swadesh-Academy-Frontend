import { BadgeCheck, Sparkles } from "lucide-react";

import Button from "./Button";
import HeroTechAnimation from "./HeroTechAnimation";

const highlights = [
  "Live learning paths",
  "Career-focused mentorship",
  "Project-first training",
];

const metrics = [
  { label: "Programs", value: "20+" },
  { label: "Support", value: "1:1" },
  { label: "Outcome Focus", value: "100%" },
];

export default function HeroSection({ text1, text2 }) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-800/50 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] lg:px-10 lg:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.32),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.18),transparent_26%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent)] lg:block" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,1.02fr)]">
        <div className="flex flex-col justify-center gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
            <Sparkles size={14} className="text-orange-300" />
            Your all-in-one learning platform
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
              Swadesh Academy
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-heading font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {text1}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-orange-300 bg-clip-text text-transparent">
                {text2}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Get hands-on training on AI and modern software development from
              industry-focused experts.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/12 hover:text-white hover:shadow-[0_16px_34px_rgba(34,211,238,0.16)]"
              >
                <BadgeCheck size={16} className="text-blue-300 transition duration-300 group-hover:scale-110 group-hover:text-cyan-200" />
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button name="Explore Courses" styleType="primary" link="/Courses" />
            <Button name="Talk To Us" styleType="outline" link="/#contact" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="group rounded-2xl border border-white/10 bg-white/7 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
              >
                <p className="text-2xl font-heading font-bold text-white transition duration-300 group-hover:text-cyan-300">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm text-slate-300 transition duration-300 group-hover:text-white">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <HeroTechAnimation />
      </div>
    </section>
  );
}
