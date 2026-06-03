import { useEffect, useRef } from "react";
import {
  Atom,
  Blocks,
  Brain,
  Braces,
  Cloud,
  Container,
  Database,
  FileJson2,
  Github,
  ServerCog,
  TerminalSquare,
} from "lucide-react";

import SocialProofSection from "./SocialProofSection";

const techItems = [
  { label: "JavaScript", icon: FileJson2, top: "10%", left: "14%", delay: "0s" },
  { label: "Python", icon: Braces, top: "20%", left: "64%", delay: "1.1s" },
  { label: "React", icon: Atom, top: "44%", left: "16%", delay: "2.1s" },
  { label: "Next.js", icon: Blocks, top: "12%", left: "42%", delay: "0.7s" },
  { label: "Node.js", icon: ServerCog, top: "58%", left: "58%", delay: "1.5s" },
  { label: "TypeScript", icon: TerminalSquare, top: "63%", left: "28%", delay: "2.6s" },
  { label: "AI / ML", icon: Brain, top: "34%", left: "75%", delay: "0.9s" },
  { label: "Docker", icon: Container, top: "74%", left: "70%", delay: "3.1s" },
  { label: "MongoDB", icon: Database, top: "72%", left: "7%", delay: "2.3s" },
  { label: "SQL", icon: Database, top: "49%", left: "44%", delay: "1.3s" },
  { label: "GitHub", icon: Github, top: "28%", left: "7%", delay: "1.8s" },
  { label: "Cloud", icon: Cloud, top: "16%", left: "82%", delay: "2.5s" },
];

export default function HeroTechAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    function handlePointerMove(event) {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 16;

      container.style.setProperty("--parallax-x", `${x}px`);
      container.style.setProperty("--parallax-y", `${y}px`);
    }

    function resetPointer() {
      container.style.setProperty("--parallax-x", "0px");
      container.style.setProperty("--parallax-y", "0px");
    }

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", resetPointer);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="hero-orbit relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl [--parallax-x:0px] [--parallax-y:0px] sm:min-h-[390px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.14),transparent_38%)]" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M17 22 C32 28, 44 35, 48 52" stroke="rgba(103,232,249,0.35)" strokeWidth="0.3" fill="none" />
          <path d="M48 52 C58 45, 68 35, 82 20" stroke="rgba(125,211,252,0.28)" strokeWidth="0.3" fill="none" />
          <path d="M20 76 C38 66, 52 60, 70 72" stroke="rgba(59,130,246,0.25)" strokeWidth="0.3" fill="none" />
          <path d="M30 16 C40 22, 54 24, 64 18" stroke="rgba(147,197,253,0.2)" strokeWidth="0.3" fill="none" />
        </svg>

        <div className="hero-orbit-core absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20 bg-cyan-300/10 blur-[2px]" />
        <div className="hero-orbit-ring absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
        <div className="hero-orbit-ring absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

        {techItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="hero-tech-node absolute"
              style={{
                top: item.top,
                left: item.left,
                animationDelay: item.delay,
                transform: `translate(calc(var(--parallax-x) * ${(index % 4) + 1} / 18), calc(var(--parallax-y) * ${((index + 2) % 4) + 1} / 18))`,
              }}
            >
              <div className="hero-tech-chip flex items-center gap-2 rounded-full border border-cyan-200/18 bg-slate-950/65 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.12)] backdrop-blur">
                <Icon size={15} className="text-cyan-300" />
                {item.label}
              </div>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 14 }).map((_, index) => (
            <span
              key={`particle-${index}`}
              className="hero-code-particle absolute rounded-full bg-cyan-300/80"
              style={{
                left: `${8 + index * 6}%`,
                top: `${20 + ((index * 13) % 55)}%`,
                animationDelay: `${index * 0.35}s`,
              }}
            />
          ))}
        </div>
      </div>

      <SocialProofSection />
    </div>
  );
}
