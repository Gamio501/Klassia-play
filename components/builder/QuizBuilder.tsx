"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Check, Loader2, Play, Save } from "lucide-react";
import type { Quiz } from "@/types/klassia";
import { createQuiz, getQuiz } from "@/lib/api/endpoints";
import { blankQuestion, useQuizStore } from "@/store/useQuizStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/components/layout/Brand";
import { cn } from "@/lib/utils/cn";
import { QuestionSidebar } from "./QuestionSidebar";
import { QuestionEditor } from "./QuestionEditor";

type Feedback = { tone: "success" | "danger"; message: string } | null;

function newDraft(): Quiz {
  return {
    id: "new",
    title: "",
    description: "",
    subject: "Ciencias Naturales",
    grade: "4° Primaria",
    status: "draft",
    accent: "brand",
    plays: 0,
    accuracy: 0,
    updatedAt: new Date().toISOString(),
    questions: [blankQuestion()],
  };
}

export function QuizBuilder({ quizId }: { quizId?: string }) {
  const router = useRouter();
  const isNew = !quizId || quizId === "new";

  const quiz = useQuizStore((state) => state.quiz);
  const init = useQuizStore((state) => state.init);
  const setTitle = useQuizStore((state) => state.setTitle);
  const lastSavedAt = useQuizStore((state) => state.lastSavedAt);

  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [starting, setStarting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (isNew) {
      init(newDraft());
      setLoading(false);
      return;
    }

    let alive = true;
    getQuiz(quizId!)
      .then((loaded) => alive && init(loaded))
      .catch(() => {
        if (!alive) return;
        setLoadError(true);
        setFeedback({
          tone: "danger",
          message: "No pudimos cargar el quiz.",
        });
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [init, isNew, quizId]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3200);
    return () => clearTimeout(timer);
  }, [feedback]);

  const persist = async (): Promise<string | null> => {
    const state = useQuizStore.getState();
    const current = state.quiz;
    if (!current) return null;

    if (!state.validate()) {
      setFeedback({
        tone: "danger",
        message: "Revisa las preguntas marcadas antes de continuar.",
      });
      return null;
    }

    setSaving(true);
    try {
      if (isNew) {
        const created = await createQuiz({
          title: current.title.trim() || "Quiz sin título",
          description: current.description,
          subject: current.subject,
          grade: current.grade,
          status: current.status,
          questions: current.questions,
        });
        setFeedback({ tone: "success", message: "Quiz creado y guardado." });
        return created.id;
      }
      const ok = await state.save();
      setFeedback(
        ok
          ? { tone: "success", message: "Cambios guardados." }
          : { tone: "danger", message: "No pudimos guardar los cambios." },
      );
      return ok ? current.id : null;
    } catch {
      setFeedback({ tone: "danger", message: "Error de red al guardar." });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    const id = await persist();
    if (id && isNew) router.replace(`/klassia-play/${id}/edit`);
  };

  const handleStart = async () => {
    setStarting(true);
    try {
      const id = await persist();
      if (id) router.push(`/klassia-play/${id}/lobby`);
    } finally {
      setStarting(false);
    }
  };

  if (loadError) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-app px-6">
        <div className="flex flex-col items-center">
          <Brand className="mb-5 h-8" />
          <div className="flex max-w-sm flex-col items-center rounded-panel border border-line bg-surface px-8 py-10 text-center shadow-card">
            <span className="grid size-11 place-items-center rounded-full bg-danger-soft text-danger">
              <AlertCircle className="size-5" />
            </span>
            <p className="mt-3 text-sm font-bold text-ink">
              No pudimos abrir el quiz
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Puede que se haya eliminado o que el enlace no sea válido.
            </p>
            <Button className="mt-4" onClick={() => router.push("/klassia-play")}>
              Volver al dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !quiz) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-app">
        <div className="flex flex-col items-center gap-4">
          <Brand className="h-8" />
          <span className="flex items-center gap-2 text-sm font-medium text-muted">
            <Loader2 className="size-4 animate-spin" />
            Cargando editor…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden">
      <header className="grid h-16 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-line bg-surface px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => router.push("/klassia-play")}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-slate-100 hover:text-ink"
            aria-label="Volver al dashboard"
          >
            <ArrowLeft className="size-4" />
          </button>

          <Brand className="hidden h-8 md:block" />

          <div className="hidden h-6 w-px bg-line sm:block" />

          <input
            value={quiz.title}
            maxLength={60}
            name="quiz-title"
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Título del quiz"
            placeholder="Título del quiz"
            className="min-w-0 flex-1 truncate rounded-lg bg-transparent px-1 py-1 text-[15px] font-bold text-ink outline-none transition-colors placeholder:font-semibold placeholder:text-slate-400 hover:bg-slate-50 focus:bg-slate-50"
          />
          <Badge tone={isNew ? "warning" : "neutral"} className="hidden shrink-0 sm:inline-flex">
            {isNew ? "Borrador" : "Borrador"}
          </Badge>
        </div>

        <div />

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "hidden items-center gap-1 text-[11px] font-medium text-muted lg:flex",
              !lastSavedAt && "opacity-0",
            )}
          >
            <Check className="size-3 text-success" />
            Guardado
          </span>
          <Button
            variant="secondary"
            onClick={handleSave}
            loading={saving}
            disabled={starting}
            aria-label="Guardar quiz"
            className="px-3 sm:px-4"
          >
            <Save className="size-4" />
            <span className="hidden sm:inline">Guardar quiz</span>
          </Button>
          <Button
            onClick={handleStart}
            loading={starting}
            disabled={saving}
            aria-label="Iniciar en vivo"
            className="px-3 sm:px-4"
          >
            <Play className="size-4 fill-current" />
            <span className="hidden sm:inline">Iniciar en vivo</span>
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="hidden md:flex md:min-h-0">
          <QuestionSidebar />
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-app">
          <QuestionEditor />
        </div>
      </div>

      {feedback && (
        <div
          className={cn(
            "animate-pop fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full px-4 py-2 text-xs font-semibold shadow-pop",
            feedback.tone === "success"
              ? "bg-success text-white"
              : "bg-danger text-white",
          )}
          role="status"
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
