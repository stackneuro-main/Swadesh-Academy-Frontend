import { Award, BadgeCheck } from "lucide-react";

import certificateImg from "../assets/Images/Blue Simple Achievement Certificate.png";

export default function Certificatepage() {
  return (
    <section className="overflow-hidden rounded-[2.5rem] border border-slate-800/40 bg-slate-950 px-6 py-12 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)] md:px-12">
      <div className="grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
            <Award size={14} />
            Certification
          </div>
          <h2 className="text-3xl font-heading font-bold tracking-tight text-white md:text-5xl">
            Get certified with confidence
          </h2>
          <p className="mx-auto max-w-xl text-base leading-7 text-slate-300 md:mx-0 md:text-lg">
            After completing any of our professional courses, you receive an
            industry-recognized certificate that adds credibility to your profile
            and makes the learning experience feel more serious and rewarding.
          </p>

          <div className="grid gap-3">
            {[
              "Industry-recognized completion certificate",
              "Higher trust for internships and entry-level roles",
              "Designed to support portfolio and profile building",
            ].map((item) => (
              <div
                key={item}
                className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-200 transition duration-300 hover:-translate-y-1 hover:border-blue-300/35 hover:bg-white/[0.09] hover:text-white hover:shadow-[0_18px_42px_rgba(37,99,235,0.16)]"
              >
                <BadgeCheck size={18} className="shrink-0 text-blue-300 transition duration-300 group-hover:scale-110 group-hover:text-cyan-200" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute h-48 w-48 rounded-full bg-blue-500/25 blur-3xl" />
          <img
            src={certificateImg}
            alt="Certificate Example"
            className="relative w-full max-w-lg rounded-[1.75rem] border border-white/10 shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
