import { cn } from "@/lib/utils/cn";

export type OptionShape = "triangle" | "diamond" | "circle" | "square";

/**
 * Formas geométricas de las opciones: la forma es el canal de identidad
 * para estudiantes con daltonismo; el color es refuerzo, no el único canal.
 */
export function Shape({
  shape,
  className,
  color = "currentColor",
}: {
  shape: OptionShape;
  className?: string;
  color?: string;
}) {
  const common = { fill: color } as const;

  if (shape === "circle") {
    return (
      <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden>
        <circle cx="12" cy="12" r="9" {...common} />
      </svg>
    );
  }
  if (shape === "square") {
    return (
      <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="3" {...common} />
      </svg>
    );
  }
  if (shape === "diamond") {
    return (
      <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden>
        <path d="M12 3l9 9-9 9-9-9z" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden>
      <path d="M12 4l9 16H3z" {...common} />
    </svg>
  );
}
