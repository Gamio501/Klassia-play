"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="animate-fade fixed inset-0 z-50 grid place-items-center bg-ink/50 p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "animate-pop flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-panel bg-surface shadow-pop",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            {title && (
              <h2 className="text-lg font-bold tracking-tight text-ink">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-muted">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-slate-100 hover:text-ink"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="no-scrollbar min-h-0 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
