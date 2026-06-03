export default function AdminStatCard({
  icon,
  iconTone = "bg-blue-50 text-blue-600",
  label,
  value,
  note,
}) {
  const Icon = icon;

  return (
    <article className="group rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconTone} shadow-inner`}>
          <Icon size={22} />
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
          Live
        </span>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-heading font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{note}</p>
    </article>
  );
}
