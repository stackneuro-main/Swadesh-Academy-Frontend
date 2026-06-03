function buildPath(points) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

export default function AdminAreaChart({ data, title, subtitle }) {
  const width = 760;
  const height = 280;
  const paddingX = 28;
  const topPadding = 18;
  const bottomPadding = 46;
  const graphHeight = height - topPadding - bottomPadding;
  const graphWidth = width - paddingX * 2;
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  const points = data.map((item, index) => ({
    x: paddingX + (index * graphWidth) / Math.max(data.length - 1, 1),
    y: topPadding + graphHeight - (item.value / maxValue) * graphHeight,
    label: item.label,
    value: item.value,
  }));

  const linePath = buildPath(points);
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${height - bottomPadding} L ${points[0].x} ${height - bottomPadding} Z`
    : "";

  const yAxisLabels = Array.from({ length: 5 }).map((_, index) => {
    const value = Math.round((maxValue / 4) * (4 - index));
    const y = topPadding + (graphHeight / 4) * index;
    return { value, y };
  });

  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
          Last 6 months
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[680px]"
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id="admin-chart-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(37,99,235,0.28)" />
              <stop offset="100%" stopColor="rgba(37,99,235,0.03)" />
            </linearGradient>
          </defs>

          {yAxisLabels.map((item) => (
            <g key={item.value}>
              <line
                x1={paddingX}
                x2={width - paddingX}
                y1={item.y}
                y2={item.y}
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="1"
              />
              <text x="0" y={item.y + 4} fontSize="12" fill="#64748b">
                {item.value}
              </text>
            </g>
          ))}

          {areaPath ? <path d={areaPath} fill="url(#admin-chart-fill)" /> : null}
          {linePath ? (
            <path
              d={linePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="5.5" fill="#2563eb" />
              <circle cx={point.x} cy={point.y} r="11" fill="rgba(37,99,235,0.12)" />
            </g>
          ))}

          {points.map((point) => (
            <text
              key={`${point.label}-axis`}
              x={point.x}
              y={height - 16}
              textAnchor="middle"
              fontSize="12"
              fill="#64748b"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
