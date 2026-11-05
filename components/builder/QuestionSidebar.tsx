"use client";

import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { QUESTIONS_PER_PAGE, useQuizStore } from "@/store/useQuizStore";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";

export function QuestionSidebar() {
  const quiz = useQuizStore((state) => state.quiz);
  const selectedId = useQuizStore((state) => state.selectedId);
  const page = useQuizStore((state) => state.page);
  const setPage = useQuizStore((state) => state.setPage);
  const selectQuestion = useQuizStore((state) => state.selectQuestion);
  const addQuestion = useQuizStore((state) => state.addQuestion);
  const errors = useQuizStore((state) => state.errors);

  const [allOpen, setAllOpen] = useState(false);

  if (!quiz) return null;

  const questions = quiz.questions;
  const totalPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const start = page * QUESTIONS_PER_PAGE;
  const visible = questions.slice(start, start + QUESTIONS_PER_PAGE);
  const errorIds = new Set(errors.map((error) => error.questionId));

  return (
    <aside className="flex h-full w-[286px] shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
          Preguntas
        </h2>
        <span className="grid min-w-5 place-items-center rounded-full bg-slate-100 px-1.5 text-[11px] font-bold text-slate-600">
          {questions.length}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 px-3">
        {visible.map((question, offset) => {
          const index = start + offset;
          const active = question.id === selectedId;
          const hasError = errorIds.has(question.id);
          return (
            <button
              key={question.id}
              onClick={() => selectQuestion(question.id)}
              className={cn(
                "group relative flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-colors duration-200",
                active
                  ? "border-brand/35 bg-brand-soft"
                  : "border-line bg-surface hover:border-slate-300 hover:bg-slate-50",
                hasError && !active && "border-danger/40 bg-danger-soft/40",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md text-[11px] font-bold",
                  active
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-600",
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 block text-[12.5px] font-semibold leading-snug text-ink">
                  {question.statement.trim() || "Pregunta sin enunciado"}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[10.5px] text-muted">
                  <Clock className="size-3" />
                  {question.timeLimit} segundos
                </span>
              </span>
            </button>
          );
        })}

        {questions.length > QUESTIONS_PER_PAGE && (
          <div className="mt-1 flex items-center justify-between gap-2 px-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="grid size-7 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-ink disabled:opacity-40"
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              onClick={() => setAllOpen(true)}
              className="text-[11px] font-semibold text-muted transition-colors hover:text-brand"
            >
              {start + 1}–{Math.min(start + QUESTIONS_PER_PAGE, questions.length)} de{" "}
              {questions.length} · Ver todas
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="grid size-7 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-ink disabled:opacity-40"
              aria-label="Página siguiente"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <Button
          variant="secondary"
          className="w-full border-dashed"
          onClick={addQuestion}
        >
          <Plus className="size-4" />
          Añadir pregunta
        </Button>
      </div>

      <Modal
        open={allOpen}
        onClose={() => setAllOpen(false)}
        title="Todas las preguntas"
        description="Selecciona una pregunta para editarla"
        className="max-w-3xl"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => {
                selectQuestion(question.id);
                setPage(Math.floor(index / QUESTIONS_PER_PAGE));
                setAllOpen(false);
              }}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors",
                question.id === selectedId
                  ? "border-brand/35 bg-brand-soft"
                  : "border-line hover:bg-slate-50",
              )}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-600">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="line-clamp-2 block text-xs font-semibold text-ink">
                  {question.statement.trim() || "Pregunta sin enunciado"}
                </span>
                <span className="text-[10px] text-muted">
                  {question.timeLimit}s · {question.points} pts
                </span>
              </span>
            </button>
          ))}
        </div>
      </Modal>
    </aside>
  );
}
