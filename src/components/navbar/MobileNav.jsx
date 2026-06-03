import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { AlignJustify, LogOut, UserRound, X } from "lucide-react";

export default function MobileNav({
  navitems,
  isAuthenticated,
  user,
  signOut,
  onScrollNavigate,
  location,
}) {
  const MotionDiv = motion.div;
  const MotionLi = motion.li;
  const MotionButton = motion.button;
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = (user?.name || "SA")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  function closeMenu() {
    setMobileOpen(false);
  }

  function handleSignOut() {
    closeMenu();
    signOut?.();
  }

  function handleScrollItem(item) {
    closeMenu();
    onScrollNavigate?.(item);
  }

  function getScrollItemClass(item) {
    const isActive =
      item.scrollTarget === "top"
        ? location?.pathname === "/" && !location?.hash
        : location?.pathname === "/" && location?.hash === `#${item.scrollTarget}`;

    return `block w-full rounded-xl px-3 py-3 text-left font-semibold ${
      isActive ? "bg-slate-900 text-white" : "text-slate-700"
    }`;
  }

  return (
    <>
      <MotionButton
        type="button"
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: mobileOpen ? 90 : 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="relative z-30 cursor-pointer rounded-full border border-slate-200 bg-white/80 p-2 text-slate-800 shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle mobile navigation"
      >
        {mobileOpen ? <X size={24} /> : <AlignJustify size={24} />}
      </MotionButton>

      {mobileOpen && (
        <MotionDiv
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-0 top-20 z-20 flex w-full flex-col gap-5 border-b border-slate-200 bg-white px-5 py-5 shadow-xl"
        >
          <ul className="flex flex-col gap-2">
            {navitems.map((item) => (
              <MotionLi
                key={item.name}
                className="rounded-xl transition hover:bg-blue-50"
              >
                {item.scrollTarget ? (
                  <button
                    type="button"
                    onClick={() => handleScrollItem(item)}
                    className={getScrollItemClass(item)}
                  >
                    {item.name}
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-3 font-semibold ${
                        isActive ? "bg-slate-900 text-white" : "text-slate-700"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                )}
              </MotionLi>
            ))}
          </ul>

          <div className="border-t border-slate-100 pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                    {user?.photo ? (
                      <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-950">{user?.name || "Learner"}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email || "Swadesh Academy"}</p>
                  </div>
                </div>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <UserRound size={18} />
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className="block rounded-full bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-primary"
              >
                Login / Signup
              </NavLink>
            )}
          </div>
        </MotionDiv>
      )}
    </>
  );
}
