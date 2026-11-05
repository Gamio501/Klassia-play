"use client";

export function TimerRing({
  total,
  remaining,
  size = 64,
}: {
  total: number;
  remaining: number;
  size?: number;
}) {
  const ratio = Math.max(0, Math.min(1, remaining / Math.max(total, 1)));
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color =
    ratio > 0.5 ? "#1769FF" : ratio > 0.25 ? "#F59E0B" : "#EF4444";

  return (
    <div
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
      role="timer"
      aria-live="off"
      aria-label={`${remaining} segundos restantes`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 300ms ease" }}
        />
      </svg>
      <span
        className="absolute font-extrabold tabular-nums"
        style={{ color, fontSize: size * 0.3 }}
      >
        {remaining}
      </span>
    </div>
  );
}
