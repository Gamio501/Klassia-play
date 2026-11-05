"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-11 w-full appearance-none rounded-xl border border-line bg-surface px-3.5 pr-9 text-sm font-medium text-ink",
          "transition-colors duration-200 hover:border-slate-300",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}
