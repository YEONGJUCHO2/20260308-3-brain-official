type RadarChartPoint = {
  label: string;
  value: number;
  display_score?: number;
};

type RadarChartProps = {
  points: RadarChartPoint[];
  compact?: boolean;
  showLabels?: boolean;
  activeIndex?: number;
  onSelectIndex?: (index: number) => void;
};

function polarToCartesian(angle: number, radius: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: 60 + radius * Math.cos(radians),
    y: 60 + radius * Math.sin(radians),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getOuterBadgePlacement(angle: number, x: number, y: number) {
  if (angle === 0) {
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -120%)",
    };
  }

  if (angle < 180) {
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: angle < 120 ? "translate(16%, -60%)" : "translate(16%, -40%)",
    };
  }

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: angle > 240 ? "translate(-116%, -60%)" : "translate(-116%, -40%)",
  };
}

export function RadarChart({
  points,
  compact = false,
  showLabels = true,
  activeIndex,
  onSelectIndex,
}: RadarChartProps) {
  const total = points.length;
  const outerRadius = compact ? 27 : 34;
  const gridRings = [outerRadius, outerRadius * 0.75, outerRadius * 0.5, outerRadius * 0.25];

  const polygon = points
    .map((point, index) => {
      const angle = (360 / total) * index;
      const radius = (clamp(point.value, 0, 10) / 10) * outerRadius;
      const { x, y } = polarToCartesian(angle, radius);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(239,63,143,0.56)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.42)" />
          </linearGradient>
        </defs>

        {gridRings.map((ring) => (
          <circle
            key={ring}
            cx="60"
            cy="60"
            r={ring}
            fill="none"
            stroke="rgba(117,110,137,0.16)"
            strokeWidth="0.7"
          />
        ))}

        {points.map((point, index) => {
          const angle = (360 / total) * index;
          const lineEnd = polarToCartesian(angle, outerRadius);

          return (
            <line
              key={`${point.label}-axis`}
              x1="60"
              y1="60"
              x2={lineEnd.x}
              y2={lineEnd.y}
              stroke="rgba(117,110,137,0.16)"
              strokeWidth="0.7"
            />
          );
        })}

        <polygon
          points={polygon}
          fill="url(#radar-fill)"
          stroke="rgba(239,63,143,0.96)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {points.map((point, index) => {
          const angle = (360 / total) * index;
          const radius = (clamp(point.value, 0, 10) / 10) * outerRadius;
          const { x, y } = polarToCartesian(angle, radius);
          const isActive = activeIndex === index;

          return (
            <circle
              key={`${point.label}-dot`}
              cx={x}
              cy={y}
              r={isActive ? (compact ? "2.8" : "3.3") : compact ? "2.1" : "2.5"}
              fill={isActive ? "rgba(239,63,143,1)" : "#fff"}
              stroke="rgba(239,63,143,1)"
              strokeWidth={isActive ? "1.8" : "1.4"}
            />
          );
        })}
      </svg>

      {showLabels
        ? points.map((point, index) => {
            const angle = (360 / total) * index;
            const outerPoint = polarToCartesian(angle, outerRadius + (compact ? 5 : 10));
            const outerPlacement = getOuterBadgePlacement(angle, outerPoint.x, outerPoint.y);

            return (
              <div key={`${point.label}-label`}>
                <button
                  type="button"
                  className={`absolute flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-[11px] font-black leading-none shadow-[var(--shadow-soft)] transition ${
                    activeIndex === index
                      ? "border-[var(--pink)] bg-[var(--pink)] text-white"
                      : "border-[rgba(224,216,235,0.95)] bg-white/96 text-[var(--text)]"
                  } ${onSelectIndex ? "cursor-pointer" : "cursor-default"}`}
                  style={{
                    left: outerPlacement.left,
                    top: outerPlacement.top,
                    transform: outerPlacement.transform,
                  }}
                  onClick={() => onSelectIndex?.(index)}
                  aria-label={`${index + 1}번 편향 ${point.label}`}
                >
                  {index + 1}
                </button>
              </div>
            );
          })
        : null}
    </div>
  );
}
