"use client";

import { useRouter } from "next/navigation";
import {
  BarChart3,
  MoreHorizontal,
  Play,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Quiz } from "@/types/klassia";
import { ACCENT_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { formatRelativeDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const COVER_ICON: Record<Quiz["accent"], LucideIcon> = {
  brand: Sparkles,
  success: BarChart3,
  danger: Users,
  warning: Users,
};

export function QuizCard({
  quiz,
  onStart,
  starting,
}: {
  quiz: Quiz;
  onStart: (quiz: Quiz) => void;
  starting: boolean;
}) {
  const accent = ACCENT_STYLES[quiz.accent];
  const Icon = COVER_ICON[quiz.accent];
  const router = useRouter();

  return (
    <article
      className={cn(
        "group flex h-full min-h-0 flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card",
        "transition-shadow duration-200 hover:shadow-pop",
      )}
    >
      <div
        className="relative flex h-14 shrink-0 items-start justify-between px-4 py-2.5"
        style={{ backgroundColor: accent.bg }}
      >
        <span className="grid size-8 place-items-center rounded-[9px] bg-white/20 text-white ring-1 ring-white/25">
          <Icon className="size-4" />
        </span>
        <button
          type="button"
          aria-label={`Opciones de ${quiz.title}`}
          className="grid size-6 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        >
          <MoreHorizontal className="size-4" />
        </button>
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-6 size-24 rounded-full bg-white/10"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1 p-3.5">
        <h3 className="truncate text-[14.5px] font-bold leading-tight tracking-[-0.01em] text-ink">
          {quiz.title}
        </h3>
        <p className="truncate text-[11px] text-muted">
          {quiz.questions.length} preguntas · {quiz.grade}
        </p>
        {quiz.description && (
          <p className="line-clamp-2 min-h-0 overflow-hidden text-[11px] leading-snug text-muted/85">
            {quiz.description}
          </p>
        )}

        <div className="mt-0.5 flex items-center gap-2">
          <Badge tone={quiz.status === "published" ? "success" : "neutral"}>
            {quiz.status === "published" ? "Publicado" : "Borrador"}
          </Badge>
          <span className="truncate text-[10px] text-muted">
            Editado {formatRelativeDate(quiz.updatedAt)}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-3 pt-1.5 text-[10.5px] font-medium text-muted">
          <span className="inline-flex items-center gap-1">
            <Play className="size-3 fill-current" />
            {quiz.plays} partidas
          </span>
          <span
            className="inline-flex items-center gap-1"
            style={{ color: accent.text }}
          >
            <BarChart3 className="size-3" />
            {quiz.accuracy}% aciertos
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="sm"
            className="flex-1"
            loading={starting}
            onClick={() => onStart(quiz)}
          >
            <Play className="size-3.5 fill-current" />
            Iniciar en vivo
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="shrink-0"
            onClick={() => router.push(`/klassia-play/${quiz.id}/edit`)}
          >
            Editar
          </Button>
        </div>
      </div>
    </article>
  );
}
