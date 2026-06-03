import {
  BadgeCheck,
  BriefcaseBusiness,
  FileCode2,
  FolderGit2,
  MessageCircleMore,
  ScrollText,
} from "lucide-react";

const benefits = [
  {
    title: "One-on-one doubt clearing sessions",
    description: "Personal support that helps students move forward without getting stuck.",
    icon: MessageCircleMore,
  },
  {
    title: "Career-oriented mentorship",
    description: "Practical guidance aligned with industry expectations and growth paths.",
    icon: BriefcaseBusiness,
  },
  {
    title: "End-to-end project development",
    description: "Students learn how complete products are planned, built, refined, and shipped.",
    icon: FileCode2,
  },
  {
    title: "Opportunity to work on real-life projects",
    description: "Hands-on experience that feels closer to professional delivery than classroom theory.",
    icon: FolderGit2,
  },
  {
    title: "Interview preparation",
    description: "Mock questions, problem-solving habits, and confidence-building for hiring rounds.",
    icon: BadgeCheck,
  },
  {
    title: "Resume building support",
    description: "Sharper positioning so student work translates into stronger applications.",
    icon: ScrollText,
  },
];

function BenefitCard({ benefit }) {
  const Icon = benefit.icon;

  return (
    <article className="benefits-card group w-[280px] shrink-0 rounded-[1.75rem] border border-slate-200/70 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur md:w-[320px]">
      <div className="inline-flex rounded-2xl border border-blue-100 bg-slate-950 p-3 text-cyan-300 shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition duration-500 group-hover:border-cyan-300/30 group-hover:text-white">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-lg font-heading font-bold tracking-tight text-slate-900">
        {benefit.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {benefit.description}
      </p>
    </article>
  );
}

export default function BenefitsSection() {
  const marqueeItems = [...benefits, ...benefits];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:max-w-3xl">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
          Student Benefits
        </div>
        <div>
          <h2 className="text-3xl font-heading font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Real support that helps students learn, build, and get career-ready
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Swadesh Academy is designed to give students consistent mentorship,
            practical project exposure, and stronger job-readiness through guided execution.
          </p>
        </div>
      </div>

      <div className="benefits-marquee relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(236,244,255,0.86))] px-4 py-5 shadow-[0_28px_70px_rgba(37,99,235,0.08)] sm:px-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-[linear-gradient(90deg,#f7f9fc,rgba(247,249,252,0))] sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-[linear-gradient(270deg,#f7f9fc,rgba(247,249,252,0))] sm:w-20" />

        <div className="benefits-track flex w-max gap-4">
          {marqueeItems.map((benefit, index) => (
            <BenefitCard key={`${benefit.title}-${index}`} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
