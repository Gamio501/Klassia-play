import { cn } from "@/lib/utils/cn";
import { Brand } from "./Brand";

export function PlayHeader({
  left,
  center,
  right,
  tone = "default",
  className,
}: {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  tone?: "default" | "onBrand";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-7",
        tone === "onBrand"
          ? "border-b border-white/15 text-white"
          : "border-b border-line bg-surface",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {left ?? <Brand tone={tone} />}
      </div>
      <div className="flex items-center justify-center">{center}</div>
      <div className="flex items-center justify-end gap-2">{right}</div>
    </header>
  );
}
