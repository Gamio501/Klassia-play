"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Download, Home, Loader2, Trophy } from "lucide-react";
import type { Quiz } from "@/types/klassia";
import { getQuiz } from "@/lib/api/endpoints";
import { MOCK_PLAYERS } from "@/lib/api/mock-data";
import { cn } from "@/lib/utils/cn";
import { points } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/Avatar";
import { Brand } from "@/components/layout/Brand";

const STEP_STYLES = {
  first: {
    block: "bg-accent",
    height: "h-[clamp(84px,14vh,132px)]",
    label: "text-accent-ink",
  },
  second: {
    block: "bg-[#C7CBD8]",
    height: "h-[clamp(64px,10vh,100px)]",
    label: "text-white",
  },
  third: {
    block: "bg-[#C97A4A]",
    height: "h-[clamp(54px,8vh,84px)]",
    label: "text-white",
  },
} as const;

function downloadCsv(quizTitle: string) {
  const rows = [
    ["posicion", "estudiante", "puntos", "aciertos"],
    ...[...MOCK_PLAYERS]
      .sort((a, b) => b.score - a.score)
      .map((player, index) => [
        String(index + 1),
        player.name,
        String(player.score),
        String(player.correctCount),
      ]),
  ];
  const csv = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${quizTitle.toLowerCase().replace(/\s+/g, "-")}-resultados.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function PodiumScreen({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [failed, setFailed] = useState(false);

  const podium = useMemo(
    () => [...MOCK_PLAYERS].sort((a, b) => b.score - a.score).slice(0, 3),
    [],
  );

  useEffect(() => {
    let alive = true;
    getQuiz(quizId)
      .then((loaded) => alive && setQuiz(loaded))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [quizId]);

  useEffect(() => {
    let cancelled = false;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      const fire = (particleRatio: number, opts: Record<string, unknown>) =>
        confetti({
          particleCount: Math.floor(180 * particleRatio),
          spread: 70,
          origin: { y: 0.32 },
          colors: ["#1769FF", "#C9F04A", "#10B981", "#EF4444", "#FFFFFF"],
          ...opts,
        });
      fire(0.35, { spread: 26, startVelocity: 55 });
      fire(0.25, { spread: 60 });
      fire(0.45, { spread: 120, decay: 0.91, scalar: 1.1 });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <div className="podium-surface grid h-[100dvh] place-items-center px-6 text-white">
        <div className="flex flex-col items-center rounded-panel border border-white/20 bg-white/10 px-8 py-9 text-center">
          <Brand tone="onBrand" className="mb-4 h-8" />
          <p className="text-sm font-bold">No pudimos cargar los resultados</p>
          <p className="mt-1 text-xs text-white/70">
            El enlace puede haber expirado o el quiz ya no existe.
          </p>
          <button
            onClick={() => router.push("/klassia-play")}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-brand-dark transition-colors hover:bg-brand-soft"
          >
            <Home className="size-4" />
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="podium-surface grid h-[100dvh] place-items-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Brand tone="onBrand" className="h-8" />
          <span className="flex items-center gap-2 text-sm font-medium">
            <Loader2 className="size-4 animate-spin" />
            Calculando resultados…
          </span>
        </div>
      </div>
    );
  }

  const [first, second, third] = podium;
  const total = MOCK_PLAYERS.length;

  return (
    <div className="podium-surface relative flex h-[100dvh] w-full flex-col items-center justify-between overflow-hidden px-6 py-6 text-white">
      <Brand
        tone="onBrand"
        className="absolute left-6 top-5 h-8 sm:h-9"
      />

      <header className="flex flex-col items-center text-center">
        <span className="grid size-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
          <Trophy className="size-5" />
        </span>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
          Quiz completado
        </p>
        <h1 className="mt-1 text-[clamp(28px,4.6vw,50px)] font-extrabold leading-none tracking-[-0.035em]">
          ¡Tenemos ganadores!
        </h1>
        <p className="mt-1.5 text-[12.5px] text-white/70">
          {quiz.title} · {total} participantes
        </p>
      </header>

      {/* Podio: 2 - 1 - 3 */}
      <div className="grid w-full max-w-3xl grid-cols-3 items-end gap-3 sm:gap-6">
        <PodiumStep
          player={second}
          position={2}
          style={STEP_STYLES.second}
          avatarSize="lg"
        />
        <PodiumStep
          player={first}
          position={1}
          style={STEP_STYLES.first}
          avatarSize="xl"
          crown
        />
        <PodiumStep
          player={third}
          position={3}
          style={STEP_STYLES.third}
          avatarSize="lg"
        />
      </div>

      <footer className="flex w-full max-w-3xl flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/75">
          <Metric label="Precisión media" value="82%" />
          <Metric label="Tiempo medio" value="9,4 s" />
          <Metric label="Pregunta más fallada" value="Órbitas y gravedad" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => downloadCsv(quiz.title)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-brand-dark transition-colors hover:bg-brand-soft"
          >
            <Download className="size-4" />
            Descargar reporte CSV
          </button>
          <button
            onClick={() => router.push("/klassia-play")}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/35 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Home className="size-4" />
            Volver al dashboard
          </button>
        </div>
      </footer>
    </div>
  );
}

function PodiumStep({
  player,
  position,
  style,
  avatarSize,
  crown = false,
}: {
  player?: { id: string; name: string; color: string; score: number };
  position: 1 | 2 | 3;
  style: (typeof STEP_STYLES)[keyof typeof STEP_STYLES];
  avatarSize: "lg" | "xl";
  crown?: boolean;
}) {
  if (!player) return <div />;

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-1">
        {crown && (
          <Crown className="absolute -top-5 left-1/2 size-4 -translate-x-1/2 rotate-0 text-accent" />
        )}
        <div className="rounded-full bg-white/95 p-1 shadow-pop">
          <Avatar name={player.name} color={player.color} size={avatarSize} />
        </div>
      </div>
      <p className="max-w-full truncate text-[13px] font-bold">{player.name}</p>
      <p className="text-[11px] font-medium text-white/70">
        {points(player.score)}
      </p>
      <div
        className={cn(
          "animate-rise mt-2 grid w-full place-items-center rounded-t-xl",
          style.block,
          style.height,
        )}
      >
        <span
          className={cn(
            "text-[clamp(22px,3vw,34px)] font-extrabold",
            style.label,
          )}
        >
          {position}
        </span>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 ring-1 ring-white/15">
      <span className="text-white/60">{label}</span>
      <strong className="font-bold text-white">{value}</strong>
    </span>
  );
}
