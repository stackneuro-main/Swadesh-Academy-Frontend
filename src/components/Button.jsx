import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { scrollToSection } from "../utils/scrollToSection";

export default function Button({ name, styleType, link }) {
  const baseStyles =
    "inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-center text-sm font-semibold shadow-md transition duration-300 sm:w-auto";
  const dynamicStyle =
    styleType === "primary"
      ? "border-primary bg-primary text-white hover:-translate-y-0.5 hover:bg-white hover:text-primary"
      : "border-white/20 bg-white/10 text-white backdrop-blur hover:-translate-y-0.5 hover:bg-white hover:text-slate-900";

  function handleClick() {
    const hashTarget = link?.split("#")[1];

    if (hashTarget) {
      window.setTimeout(() => scrollToSection(hashTarget), 80);
    }
  }

  return (
    <NavLink to={link} onClick={handleClick} className={`${baseStyles} ${dynamicStyle}`}>
      {name}
      <ArrowRight size={16} />
    </NavLink>
  );
}
