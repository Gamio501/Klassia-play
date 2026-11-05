"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, Check, Copy, Loader2, Users } from "lucide-react";
import type { Quiz } from "@/types/klassia";
import { getQuiz, startSession } from "@/lib/api/endpoints";
import { MOCK_PLAYERS } from "@/lib/api/mock-data";
import { formatPin } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PlayHeader } from "@/components/layout/PlayHeader";
import { cn } from "@/lib/utils/cn";

const TOTAL_PLAYERS = MOCK_PLAYERS.length;

export function LobbyScreen({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const [joined, setJoined] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [loadedQuiz, session] = await Promise.all([
          getQuiz(quizId),
          startSession(quizId),
        ]);
        if (!alive) return;
        setQuiz(loadedQuiz);
        setPin(session.pin);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [quizId]);

  useEffect(() => {
    if (!pin) return;
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setJoined(Math.min(count, 9));
      if (count >= 9) clearInterval(timer);
    }, 650);
    return () => clearInterval(timer);
  }, [pin]);

  const copyPin = async () => {
    if (!pin) return;
    try {
      await navigator.clipboard.writeText(pin);
    } catch {
      /* clipboard bloqueado: el PIN sigue visible */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const players = MOCK_PLAYERS.slice(0, joined);
  const visible = players.slice(0, 9);
  const overflow = joined - visible.length;

  return (
    <div className="lobby-surface flex h-[100dvh] w-full flex-col overflow-hidden text-white">
      <PlayHeader
        tone="onBrand"
        center={
          <div className="hidden items-center gap-2 text-xs font-medium text-white/75 md:flex">
            <span className="font-semibold text-white">{quiz?.title ?? "…"}</span>
            <span className="size-1 rounded-full bg-white/50" />
            <span>{quiz?.questions.length ?? 0} preguntas</span>
          </div>
        }
        right={
          <button
            onClick={() => router.push("/klassia-play")}
            className="rounded-lg border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            Salir de la sala
          </button>
        }
      />

      <main className="grid min-h-0 flex-1 grid-cols-1 items-center gap-8 px-6 pb-6 pt-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:px-10">
        {/* PIN */}
        <section className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/20">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Sala abierta
          </span>

          <h1 className="mt-3 text-[clamp(30px,4.4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance">
            ¡Únete al juego!
          </h1>
          <p className="mt-2 text-[13px] text-white/75">
            Entra en{" "}
            <span className="font-semibold text-white">play.klassia.com</span> e
            ingresa el PIN
          </p>

          <button
            onClick={copyPin}
            className="group mt-3 flex items-center gap-3"
            aria-label="Copiar PIN"
          >
            <span className="text-[clamp(38px,5.6vw,64px)] font-extrabold leading-none tracking-[0.06em] tabular-nums">
              {pin ? formatPin(pin) : "• • •   • • •"}
            </span>
            <span
              className={cn(
                "grid size-9 place-items-center rounded-lg bg-white/15 text-white transition-colors",
                copied ? "bg-success" : "group-hover:bg-white/25",
              )}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </span>
          </button>
          <p className="mt-1.5 text-[11px] text-white/60">
            {copied ? "¡PIN copiado!" : "Toca el PIN para copiarlo"}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div className="rounded-xl bg-white p-2 shadow-pop">
              {pin ? (
                <QRCodeSVG
                  value={`https://play.klassia.com/join?pin=${pin}`}
                  size={104}
                  bgColor="#FFFFFF"
                  fgColor="#0F172A"
                  level="M"
                />
              ) : (
                <div className="size-[104px] animate-pulse rounded bg-slate-100" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Escanea el código con la cámara de tu móvil
              </p>
              <p className="mt-1 max-w-[190px] text-[11px] leading-relaxed text-white/65">
                Tus estudiantes entran al instante, sin descargar nada.
              </p>
            </div>
          </div>
        </section>

        {/* Estudiantes */}
        <section className="flex min-h-0 max-h-full flex-col rounded-[26px] border border-white/20 bg-white/12 p-5 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-bold tracking-[-0.01em]">
                Estudiantes conectados
              </h2>
              <p className="mt-0.5 text-[11px] text-white/65">
                Esperando a que se una toda la clase…
              </p>
            </div>
            <span className="rounded-lg bg-white/15 px-2.5 py-1 text-[12px] font-bold tabular-nums text-white">
              {joined}/{TOTAL_PLAYERS}
            </span>
          </div>

          <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 content-start gap-2 xl:grid-cols-3">
            {visible.map((player) => (
              <div
                key={player.id}
                className="animate-pop flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-2.5 py-2"
              >
                <Avatar
                  name={player.name}
                  color={player.color}
                  size="xs"
                  className="ring-1 ring-white/30"
                />
                <span className="truncate text-[11.5px] font-semibold">
                  {player.name}
                </span>
              </div>
            ))}

            {Array.from({ length: Math.max(0, 9 - visible.length) }).map(
              (_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-white/15 px-2.5 py-2"
                >
                  <span className="size-6 rounded-full bg-white/10" />
                  <span className="h-2 w-12 rounded bg-white/10" />
                </div>
              ),
            )}

            {overflow > 0 && (
              <div className="flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/15 px-2.5 py-2 text-[11.5px] font-semibold">
                <Users className="size-3.5" />+{overflow} más
              </div>
            )}
          </div>

          <Button
            variant="onBrand"
            size="lg"
            className="mt-3 w-full justify-between px-5"
            onClick={() => router.push(`/klassia-play/${quizId}/live`)}
            disabled={!pin}
          >
            <span className="flex items-center gap-2">
              {!pin && <Loader2 className="size-4 animate-spin" />}
              Comenzar juego
            </span>
            <ArrowRight className="size-4" />
          </Button>
        </section>
      </main>

      {error && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-danger px-4 py-2 text-xs font-semibold shadow-pop">
          No pudimos abrir la sala. Vuelve al dashboard e inténtalo de nuevo.
        </div>
      )}
    </div>
  );
}
