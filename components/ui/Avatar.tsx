import { cn } from "@/lib/utils/cn";
import { initials } from "@/lib/utils/format";

const SIZES = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-[11px]",
  md: "size-10 text-xs",
  lg: "size-14 text-sm",
  xl: "size-20 text-lg",
} as const;

export function Avatar({
  name,
  color,
  size = "md",
  className,
  ring = false,
}: {
  name: string;
  color: string;
  size?: keyof typeof SIZES;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-bold text-white",
        SIZES[size],
        ring && "ring-2 ring-white/70",
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
