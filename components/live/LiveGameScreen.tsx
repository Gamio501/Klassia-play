"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trophy, Users, X } from "lucide-react";
import type { Player, Quiz } from "@/types/klassia";
import { getQuiz } from "@/lib/api/endpoints";
import { MOCK_PLAYERS } from "@/lib/api/mock-data";
import { OPTION_ACCENTS } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { points } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Shape } from "@/components/ui/Shape";
import { Brand } from "@/components/layout/Brand";
import { PlayHeader } from "@/components/layout/PlayHeader";
import { TimerRing } from "./TimerRing";

export function LiveGameScreen({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [rankingOpen, setRankingOpen] = useState(false);
  const [error, setError] = useState(false);
  const rankingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const players = useMemo<Player[]>(() => MOCK_PLAYERS, []);
  const total = players.length;

  useEffect(() => {
    let alive = true;
    getQuiz(quizId)
      .then((loaded) => alive && setQuiz(loaded))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [quizId]);

  const question = quiz?.questions[index];
  const totalQuestions = quiz?.questions.length ?? 0;

  // Reinicia el temporizador en cada pregunta.
  useEffect(() => {
    if (!question) return;
    setTimeLeft(question.timeLimit);
    setAnswered(0);
    setRevealed(false);
  }, [question]);

  const reveal = useCallback(() => {
    setRevealed(true);
    if (rankingTimer.current) clearTimeout(rankingTimer.current);
    rankingTimer.current = setTimeout(() => setRankingOpen(true), 1600);
  }, []);

  // Cuenta regresiva.
  useEffect(() => {
    if (!question || revealed) return;
    if (timeLeft <= 0) {
      reveal();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [question, revealed, timeLeft, reveal]);

  // Simulación de estudiantes respondiendo.
  useEffect(() => {
    if (!question || revealed) return;
    const timer = setInterval(() => {
      setAnswered((value) => {
        const next = value + 1 + Math.floor(Math.random() * 3);
        return Math.min(next, total);
      });
    }, 900);
    return () => clearInterval(timer);
  }, [question, revealed, total]);

  useEffect(
    () => () => {
      if (rankingTimer.current) clearTimeout(rankingTimer.current);
    },
    [],
  );

  const nextQuestion = () => {
    setRankingOpen(false);
    if (index + 1 >= totalQuestions) {
      router.push(`/klassia-play/${quizId}/podium`);
      return;
    }
    setIndex((value) => value + 1);
  };

  if (error) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-app px-6">
        <div className="flex flex-col items-center">
          <Brand className="mb-5 h-8" />
          <div className="flex flex-col items-center rounded-panel border border-line bg-surface px-8 py-9 text-center shadow-card">
            <p className="text-sm font-bold text-ink">
              No pudimos cargar la partida
            </p>
            <p className="mt-1 text-xs text-muted">
              Revisa el enlace o vuelve a iniciar el quiz.
            </p>
            <Button className="mt-4" onClick={() => router.push("/klassia-play")}>
              Volver al dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !question) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-app">
        <div className="flex flex-col items-center gap-4">
          <Brand className="h-8" />
          <span className="flex items-center gap-2 text-sm font-medium text-muted">
            <Loader2 className="size-4 animate-spin" />
            Preparando la partida…
          </span>
        </div>
      </div>
    );
  }

  const correctIndex = question.options.findIndex((option) => option.correct);
  const leaderboard = [...players].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-app">
      <PlayHeader
        center={
          <Badge tone="brand" className="normal-case tracking-normal">
            Pregunta {index + 1} / {totalQuestions}
          </Badge>
        }
        right={
          revealed ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRankingOpen(true)}
              >
                <Trophy className="size-4" />
                Ver ranking
              </Button>
              <Button size="sm" onClick={nextQuestion}>
                {index + 1 >= totalQuestions ? "Ver podio" : "Siguiente"}
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={reveal}>
              <X className="size-4" />
              Cerrar pregunta
            </Button>
          )
        }
      />

      <main className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-4 sm:px-7">
        <div className="flex shrink-0 items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-muted shadow-card">
            <Users className="size-3.5" />
            <strong className="text-[12px] font-bold text-ink tabular-nums">
              {answered}/{total}
            </strong>
            respuestas recibidas
          </span>

          <TimerRing
            total={question.timeLimit}
            remaining={revealed ? 0 : timeLeft}
            size={68}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="grid min-h-0 flex-1 place-items-center rounded-panel border border-line bg-surface px-6 py-6 shadow-card">
            <p className="text-center text-[clamp(20px,2.9vw,34px)] font-extrabold leading-tight tracking-[-0.025em] text-ink text-balance">
              {question.statement}
            </p>
          </div>

          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.slice(0, 4).map((option, optionIndex) => {
              const accent = OPTION_ACCENTS[optionIndex % OPTION_ACCENTS.length];
              const isCorrect = optionIndex === correctIndex;
              const dimmed = revealed && !isCorrect;
              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex min-h-[76px] items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300",
                    dimmed
                      ? "border-line bg-surface text-muted"
                      : "border-transparent text-white",
                    revealed && isCorrect && "scale-[1.015] shadow-pop",
                  )}
                  style={dimmed ? undefined : { backgroundColor: accent.color }}
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full",
                      dimmed ? "bg-slate-100" : "bg-white/25",
                    )}
                  >
                    <Shape
                      shape={accent.shape}
                      color={dimmed ? "#94A3B8" : "#FFFFFF"}
                      className="size-3.5"
                    />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[clamp(14px,1.5vw,19px)] font-bold">
                    {option.text}
                  </span>
                  {revealed && isCorrect && (
                    <span className="animate-pop grid size-7 shrink-0 place-items-center rounded-full bg-white text-[#047857]">
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Modal
        open={rankingOpen}
        onClose={() => setRankingOpen(false)}
        title="Top 5 de la clase"
        description={
          index + 1 >= totalQuestions
            ? "Última pregunta cerrada"
            : "Ranking parcial de la partida"
        }
        className="max-w-lg"
      >
        <ol className="flex flex-col gap-2">
          {leaderboard.map((player, position) => (
            <li
              key={player.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                position === 0
                  ? "border-brand/30 bg-brand-soft"
                  : "border-line bg-surface",
              )}
            >
              <span className="w-5 text-center text-sm font-extrabold text-muted">
                {position + 1}
              </span>
              <Avatar name={player.name} color={player.color} size="sm" />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                {player.name}
              </span>
              <span className="text-xs font-bold tabular-nums text-ink">
                {points(player.score)}
              </span>
            </li>
          ))}
        </ol>

        <Button className="mt-4 w-full" size="lg" onClick={nextQuestion}>
          {index + 1 >= totalQuestions
            ? "Ver podio final"
            : "Siguiente pregunta"}
        </Button>
      </Modal>
    </div>
  );
}
