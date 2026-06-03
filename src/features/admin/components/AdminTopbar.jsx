import {
  Bell,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

function getInitials(name) {
  return (name || "A")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AdminTopbar({
  searchTerm,
  onSearchChange,
  notificationCount,
  user,
  onOpenMobileSidebar,
  onCreateCourse,
  onCreateTeacher,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="relative min-w-0 flex-1 xl:w-[440px]">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search anything..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 xl:justify-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCreateCourse}
              className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1d4ed8,#2563eb)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(37,99,235,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(37,99,235,0.32)]"
            >
              <Plus size={16} />
              New Course
            </button>
            <button
              type="button"
              onClick={onCreateTeacher}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <UserPlus size={16} />
              Add Teacher
            </button>
          </div>

          <button
            type="button"
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notificationCount > 0 ? (
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
            ) : null}
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="h-12 w-12 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1e293b,#334155)] text-sm font-semibold text-white">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name || "Admin"}</p>
              <div className="mt-1 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                <ShieldCheck size={13} className="text-blue-600" />
                {(user?.role || "admin").replace(/^./, (char) => char.toUpperCase())}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
