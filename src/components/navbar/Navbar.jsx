import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";

import logo from "../../assets/Images/Swadesh Academy new logo.png";
import { useAuth } from "../../features/auth/useAuth";
import { scrollToSection } from "../../utils/scrollToSection";
import MobileNav from "./MobileNav";

const scrollNavTargets = ["top", "about", "contact"];
const activeScrollOffset = 120;

export default function Navbar() {
  const { isAuthenticated, signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeScrollTarget, setActiveScrollTarget] = useState("top");
  const profileMenuRef = useRef(null);
  const navItem = [
    { name: "Home", path: "/", scrollTarget: "top" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/", scrollTarget: "about" },
    { name: "Request a Call Back", path: "/", scrollTarget: "contact" },
  ];
  const navItems = user?.role === "admin" ? [...navItem, { name: "Admin", path: "/admin" }] : navItem;

  const initials = (user?.name || "SA")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveScrollTarget("");
      return undefined;
    }

    let frameId = 0;

    function updateActiveSection() {
      frameId = 0;
      const currentPosition = window.scrollY + activeScrollOffset;
      let nextActiveTarget = "top";

      scrollNavTargets.forEach((targetId) => {
        if (targetId === "top") {
          return;
        }

        const target = document.getElementById(targetId);
        if (!target) {
          return;
        }

        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        if (currentPosition >= targetTop) {
          nextActiveTarget = targetId;
        }
      });

      setActiveScrollTarget((current) =>
        current === nextActiveTarget ? current : nextActiveTarget,
      );
    }

    function scheduleActiveSectionUpdate() {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveSection);
    }

    updateActiveSection();
    const delayedUpdateId = window.setTimeout(updateActiveSection, 500);
    window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveSectionUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.clearTimeout(delayedUpdateId);
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);
    };
  }, [location.pathname]);

  function handleSignOut() {
    setProfileOpen(false);
    signOut();
  }

  function handleScrollNavigation(item) {
    const nextPath = item.scrollTarget === "top" ? "/" : `/#${item.scrollTarget}`;
    setActiveScrollTarget(item.scrollTarget);
    navigate(nextPath);
    window.setTimeout(() => scrollToSection(item.scrollTarget), 80);
  }

  function getScrollItemClass(item) {
    const isActive = location.pathname === "/" && activeScrollTarget === item.scrollTarget;

    return isActive
      ? "rounded-full bg-slate-900 px-4 py-2 text-white shadow-sm"
      : "rounded-full px-4 py-2 transition hover:bg-white hover:text-primary";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-lg font-semibold text-slate-900 sm:text-xl">
          <img
            src={logo}
            alt="Swadesh Academy logo"
            className="h-12 w-auto sm:h-14"
          />
        </div>

        <div>
          <ul className="hidden items-center justify-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.scrollTarget ? (
                  <button
                    type="button"
                    onClick={() => handleScrollNavigation(item)}
                    className={getScrollItemClass(item)}
                  >
                    {item.name}
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "rounded-full bg-slate-900 px-4 py-2 text-white shadow-sm"
                        : "rounded-full px-4 py-2 transition hover:bg-white hover:text-primary"
                    }
                  >
                    {item.name}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-blue-100 bg-white text-sm font-bold text-blue-700 shadow-[0_10px_24px_rgba(37,99,235,0.16)] ring-4 ring-blue-50 transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(37,99,235,0.22)]"
              >
                {user?.photo ? (
                  <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </button>

              <div
                role="menu"
                className={`absolute right-0 top-14 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_22px_55px_rgba(15,23,42,0.16)] transition duration-200 ${
                  profileOpen
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="truncate text-sm font-bold text-slate-950">{user?.name || "Learner"}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email || "Swadesh Academy"}</p>
                </div>
                <NavLink
                  to="/profile"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <UserRound size={17} />
                  Profile
                </NavLink>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/profile"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-primary"
            >
              Login / Signup
            </NavLink>
          )}
        </div>

        <div className="lg:hidden">
          <MobileNav
            navitems={navItems}
            isAuthenticated={isAuthenticated}
            user={user}
            signOut={signOut}
            onScrollNavigate={handleScrollNavigation}
            location={location}
            activeScrollTarget={activeScrollTarget}
          />
        </div>
      </div>
    </nav>
  );
}
