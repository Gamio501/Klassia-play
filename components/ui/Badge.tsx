import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "brand" | "success" | "danger" | "warning" | "onBrand";

const TONES: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  brand: "bg-brand-soft text-brand-dark",
  success: "bg-success-soft text-[#047857]",
  danger: "bg-danger-soft text-[#B91C1C]",
  warning: "bg-warning-soft text-[#B45309]",
  onBrand: "bg-white/15 text-white backdrop-blur-sm",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
