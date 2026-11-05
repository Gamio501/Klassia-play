"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Play,
  Plus,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { Quiz } from "@/types/klassia";
import {
  getDashboardStats,
  listQuizzes,
  type DashboardStats,
} from "@/lib/api/endpoints";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PlayHeader } from "@/components/layout/PlayHeader";
import { ScreenBody, ScreenShell } from "@/components/layout/ScreenShell";
import { QuizCard } from "./QuizCard";
import { cn } from "@/lib/utils/cn";

function StatCard({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Play;
  value: string;
  label: string;
  tone: "brand" | "success" | "warning";
}) {
  const tones = {
    brand: "bg-brand-soft text-brand-dark",
    success: "bg-success-soft text-[#047857]",
    warning: "bg-warning-soft text-[#B45309]",
  } as const;

  return (
    <div className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3 shadow-card">
      <span
        className={cn("grid size-9 shrink-0 place-items-center rounded-[10px]", tones[tone])}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-extrabold leading-tight tracking-[-0.02em] text-ink">
          {value}
        </p>
        <p className="truncate text-[11px] font-medium text-muted">{label}</p>
      </div>
    </div>
  );
}

export function DashboardScreen() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [allOpen, setAllOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([listQuizzes(), getDashboardStats()])
      .then(([list, dashboardStats]) => {
        if (!alive) return;
        setQuizzes(list);
        setStats(dashboardStats);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const start = (quiz: Quiz) => {
    router.push(`/klassia-play/${quiz.id}/lobby`);
  };

  return (
    <ScreenShell>
      <PlayHeader
        right={
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-medium text-muted sm:block">
              María López
            </span>
            <Avatar name="María López" color="#1769FF" size="sm" />
          </div>
        }
      />

      <ScreenBody className="px-5 pt-4 pb-5 sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
              Klassia Play
            </span>
            <h1 className="mt-1 text-[clamp(24px,3vw,32px)] font-extrabold leading-none tracking-[-0.03em] text-ink">
              Tus quizzes
            </h1>
            <p className="mt-1.5 text-[13px] text-muted">
              Crea, juega y descubre cómo aprende tu clase.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push("/klassia-play/new")}
            className="min-w-[220px]"
          >
            <Plus className="size-4" />
            Crear nuevo quiz
          </Button>
        </div>

        <div className="mt-4 hidden grid-cols-3 gap-3 sm:grid">
          <StatCard
            icon={Play}
            value={String(stats?.playsThisMonth ?? 10)}
            label="Partidas este mes"
            tone="brand"
          />
          <StatCard
            icon={Users}
            value={String(stats?.participations ?? 128)}
            label="Participaciones"
            tone="success"
          />
          <StatCard
            icon={Target}
            value={`${stats?.averageAccuracy ?? 81}%`}
            label="Promedio de aciertos"
            tone="warning"
          />
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between pb-2">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-ink">
              Recientes
              <Badge tone="neutral">{quizzes.length}</Badge>
            </h2>
            <button
              onClick={() => setAllOpen(true)}
              className="text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              Ver todos
            </button>
          </div>

          {loading ? (
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-full animate-pulse rounded-card border border-line bg-surface"
                />
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="grid flex-1 place-items-center rounded-card border border-dashed border-line bg-surface/60 text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
                  <Sparkles className="size-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink">
                  Aún no tienes quizzes
                </p>
                <p className="mt-1 text-xs text-muted">
                  Crea el primero y juega con tu clase en minutos.
                </p>
              </div>
            </div>
          ) : (
            <div className="no-scrollbar flex min-h-0 flex-1 items-start gap-4 overflow-x-auto pb-1 md:grid md:auto-rows-min md:content-start md:grid-cols-2 md:overflow-visible xl:grid-cols-3 md:[&>*:nth-child(n+3)]:hidden xl:[&>*:nth-child(n+3)]:block xl:[&>*:nth-child(n+4)]:hidden">
              {quizzes.slice(0, 6).map((quiz) => (
                <div
                  key={quiz.id}
                  className="min-h-0 w-[78%] shrink-0 md:w-auto md:shrink"
                >
                  <QuizCard quiz={quiz} onStart={start} starting={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </ScreenBody>

      <Modal
        open={allOpen}
        onClose={() => setAllOpen(false)}
        title="Todos tus quizzes"
        description={`${quizzes.length} quizzes en tu biblioteca`}
        className="max-w-3xl"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5"
            >
              <span
                className="grid size-8 place-items-center rounded-lg text-white"
                style={{ backgroundColor: `var(--color-${quiz.accent})` }}
              >
                <BarChart3 className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {quiz.title}
                </p>
                <p className="text-[11px] text-muted">
                  {quiz.questions.length} preguntas · {quiz.grade}
                </p>
              </div>
              <Button size="sm" onClick={() => start(quiz)}>
                Jugar
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </ScreenShell>
  );
}
