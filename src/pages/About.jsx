import { Compass, Layers3, Rocket, ShieldCheck } from "lucide-react";

import Button from "../components/Button";

const aboutSections = [
  {
    title: "Who We Are",
    text: "We are building Swadesh Academy as a modern education platform that combines coaching, technical learning, and real skill development into one more credible experience.",
    icon: Compass,
  },
  {
    title: "Our Mission",
    text: "To deliver high-quality, structured education that helps learners become more confident academically and professionally.",
    icon: Rocket,
  },
  {
    title: "What We Offer",
    text: "From school-level guidance to software development programs, our offerings are designed to feel practical, focused, and future-oriented.",
    icon: Layers3,
  },
  {
    title: "Why Choose Us",
    text: "Students need clarity, consistency, mentorship, and trust. This platform is being shaped to communicate all four much more strongly.",
    icon: ShieldCheck,
  },
];

export default function About() {
  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-[2.5rem] border border-slate-800/40 bg-slate-950 px-6 py-12 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-200">About Swadesh Academy</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-heading font-bold tracking-tight sm:text-5xl">
          Empowering future software professionals through industry-focused training, real-world projects, AI innovation, and career-oriented mentorship.
       </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
          Building industry-ready developers through practical learning, real-world projects, and expert mentorship.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {aboutSections.map((section) => {
          const Icon = section.icon;

          return (
            <article
              key={section.title}
              className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-md backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                <Icon size={20} />
              </div>
              <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight text-slate-900">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.text}</p>
            </article>
          );
        })}
      </div>

      <div className="rounded-[2rem] border border-white/60 bg-white/85 p-8 text-center shadow-lg backdrop-blur">
        <p className="text-lg text-slate-700">Ready to start your journey with us?</p>
        <div className="mt-5 flex justify-center">
          <Button name="Contact Us" styleType="primary" link="/Contact" />
        </div>
      </div>
    </section>
  );
}
