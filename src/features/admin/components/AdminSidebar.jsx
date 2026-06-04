import {
  BarChart3,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  Settings2,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import logo from "../../../assets/Images/Swadesh Academy new logo.png";

const iconMap = {
  dashboard: LayoutDashboard,
  courses: BookOpenCheck,
  students: Users,
  teachers: UserRound,
  enrollmentRequests: ClipboardCheck,
  enrollments: ClipboardCheck,
  payments: WalletCards,
  reports: BarChart3,
  settings: Settings2,
  profile: UserRound,
};

export default function AdminSidebar({
  items,
  selectedSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
      />

      <aside
        className={`admin-sidebar fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-r border-blue-950/40 bg-[linear-gradient(180deg,#07142c_0%,#071a3c_42%,#081124_100%)] text-white shadow-[20px_0_60px_rgba(2,6,23,0.22)] transition-all duration-300 ease-out lg:translate-x-0 ${
          collapsed ? "w-[92px]" : "w-[288px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
          <div className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? "justify-center" : ""}`}>
            {collapsed ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 shadow-[0_18px_35px_rgba(15,23,42,0.35)]">
                <img src={logo} alt="Swadesh Academy" className="h-8 w-8 object-contain" />
              </div>
            ) : (
              <div className="rounded-[1.35rem] bg-white/6 px-3 py-3 shadow-[0_18px_35px_rgba(15,23,42,0.35)]">
                <img src={logo} alt="Swadesh Academy" className="h-12 w-auto object-contain" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden rounded-xl border border-white/10 bg-white/5 p-2 text-blue-100 transition hover:border-white/20 hover:bg-white/10 lg:inline-flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-blue-100 transition hover:border-white/20 hover:bg-white/10 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = iconMap[item.id];
              const isActive = selectedSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    onCloseMobile();
                  }}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition duration-300 ${
                    isActive
                      ? "bg-[linear-gradient(135deg,#1d4ed8,#1e40af)] text-white shadow-[0_18px_35px_rgba(30,64,175,0.35)]"
                      : "text-blue-50/88 hover:bg-white/8 hover:text-white"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 ${
                      isActive ? "bg-white/14" : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <Icon size={20} />
                  </span>

                  <span
                    className={`min-w-0 transition-all duration-300 ${
                      collapsed ? "w-0 translate-x-2 opacity-0" : "w-auto translate-x-0 opacity-100"
                    }`}
                  >
                    <span className="block truncate text-sm font-semibold">{item.label}</span>
                    <span className="block truncate text-xs text-white/60">{item.caption}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-4 pb-5">
          <div className={`rounded-[1.6rem] border border-white/10 bg-white/6 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.28)] transition-all duration-300 ${collapsed ? "text-center" : ""}`}>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
              <BookOpenCheck size={20} />
            </div>
            <div className={`mt-3 transition-all duration-300 ${collapsed ? "hidden" : "block"}`}>
              <p className="text-sm font-semibold text-white">Swadesh Academy</p>
              <p className="mt-2 text-xs leading-6 text-blue-100/70">
                Modern training operations for courses, learners, and growth.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
