import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Instagram, Youtube } from "lucide-react";

import FeedbackMessage from "./ui/FeedbackMessage";
import LoadingState from "./ui/LoadingState";
import { useSocialStats } from "../features/social/hooks/useSocialStats";

const iconMap = {
  youtube: Youtube,
  instagram: Instagram,
};

function formatCompactNumber(value) {
  if (!Number.isFinite(value)) {
    return "";
  }

  if (value >= 1_000_000) {
    const result = (value / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${result}M`;
  }

  if (value >= 1_000) {
    const result = (value / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${result}K`;
  }

  return `${value}`;
}

function AnimatedCount({ value, fallbackDisplay }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(value) || value <= 0) {
      return undefined;
    }

    let frameId = 0;
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [value]);

  if (!Number.isFinite(value) || value <= 0) {
    return fallbackDisplay;
  }

  return formatCompactNumber(displayValue || value);
}

export default function SocialProofSection() {
  const { data, isLoading, isError, error } = useSocialStats();

  const items = useMemo(() => {
    if (!data) {
      return [];
    }

    return [data.youtube, data.instagram].filter(
      (item) => item && typeof item === "object" && item.platform,
    );
  }, [data]);

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {isLoading ? <LoadingState label="Loading community stats..." /> : null}
      {isError ? <FeedbackMessage type="error" message={error.message} /> : null}

      {!isLoading && !isError
        ? items.map((item) => {
            const Icon = iconMap[item.platform] || ArrowUpRight;

            return (
              <a
                key={item.platform}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_20px_40px_rgba(2,8,23,0.28)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/16 hover:shadow-[0_24px_48px_rgba(249,115,22,0.14)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex rounded-2xl border border-white/10 bg-white/6 p-3 text-white shadow-[0_0_26px_rgba(249,115,22,0.12)]">
                      <Icon size={24} className="text-orange-400" />
                    </div>

                    <p className="text-4xl font-heading font-extrabold tracking-tight text-orange-400 sm:text-5xl">
                      <AnimatedCount
                        value={item.count_value}
                        fallbackDisplay={item.display_count}
                      />
                    </p>
                  </div>

                  <ArrowUpRight className="text-slate-500 transition group-hover:text-orange-300" />
                </div>

                <div className="mt-5">
                  <p className="text-2xl font-heading font-bold tracking-tight text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                    {item.subtitle}
                  </p>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-400">
                  {item.supporting_text}
                </p>
              </a>
            );
          })
        : null}
    </div>
  );
}
