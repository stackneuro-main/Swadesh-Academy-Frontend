import { Compass, Layers3, Rocket, ShieldCheck } from "lucide-react";

const aboutCards = [
  {
    title: "Who We Are",
    text: "Swadesh Academy blends academic support, technical learning, and mentorship into one practical learning experience.",
    icon: Compass,
  },
  {
    title: "Our Mission",
    text: "We help learners build confidence through structured classes, clear guidance, and consistent practice.",
    icon: Rocket,
  },
  {
    title: "Why Choose Us",
    text: "Students get clarity, accountability, trusted mentorship, and a learning path shaped around real progress.",
    icon: ShieldCheck,
  },
  {
    title: "What We Offer",
    text: "From school-level foundations to software development programs, every course is focused and future-ready.",
    icon: Layers3,
  },
];

function AboutCard({ card }) {
  const Icon = card.icon;

  return (
    <article className="about-marquee-card group">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20 transition duration-300 group-hover:bg-blue-600">
        <Icon size={22} />
      </div>
      <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-slate-950">
        {card.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
    </article>
  );
}

function AboutMarqueeRow({ cards }) {
  const repeatedCards = [...cards, ...cards];

  return (
    <div className="about-marquee" aria-hidden="false">
      <div className="about-marquee-track">
        {repeatedCards.map((card, index) => (
          <AboutCard key={`${card.title}-${index}`} card={card} />
        ))}
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 space-y-8 py-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-900/10 bg-slate-950 px-6 py-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-blue-200">About Swadesh Academy</p>
        <h2 className="mt-4 max-w-4xl font-heading text-3xl font-bold tracking-tight sm:text-5xl">
          Empowering future software professionals through industry-focused training,
          real projects, and career-oriented mentorship.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
          We are building a trusted academy experience where learners get strong fundamentals,
          practical exposure, and guidance that keeps them moving forward.
        </p>
      </div>

      <AboutMarqueeRow cards={aboutCards} />
    </section>
  );
}
