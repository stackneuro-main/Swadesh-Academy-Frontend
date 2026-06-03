export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-2xl border border-blue-100 bg-white/90 p-6 text-center shadow-sm">
      <div className="flex items-center gap-3 text-blue-700">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
