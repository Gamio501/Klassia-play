"use client";

import { Check, ChevronLeft, ChevronRight, Clock, Copy, Plus, Trash2, X } from "lucide-react";
import { OPTION_ACCENTS, POINTS_OPTIONS, QUESTION_TYPES, TIME_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { uid } from "@/lib/utils/format";
import { useQuizStore } from "@/store/useQuizStore";
import { Select } from "@/components/ui/Select";
import { Shape } from "@/components/ui/Shape";
import type { QuestionType } from "@/types/klassia";

export function QuestionEditor() {
  const quiz = useQuizStore((state) => state.quiz);
  const selectedId = useQuizStore((state) => state.selectedId);
  const errors = useQuizStore((state) => state.errors);
  const patchQuestion = useQuizStore((state) => state.patchQuestion);
  const patchOption = useQuizStore((state) => state.patchOption);
  const addOption = useQuizStore((state) => state.addOption);
  const removeOption = useQuizStore((state) => state.removeOption);
  const markCorrect = useQuizStore((state) => state.markCorrect);
  const duplicateQuestion = useQuizStore((state) => state.duplicateQuestion);
  const removeQuestion = useQuizStore((state) => state.removeQuestion);
  const selectQuestion = useQuizStore((state) => state.selectQuestion);

  if (!quiz) return null;
  const index = quiz.questions.findIndex((item) => item.id === selectedId);
  const question = quiz.questions[index];
  if (!question) return null;

  const error = errors.find((item) => item.questionId === question.id);
  const isOpen = question.type === "open";

  const changeType = (type: QuestionType) => {
    if (type === "truefalse") {
      patchQuestion(question.id, {
        type,
        options: [
          { id: uid("o"), text: "Verdadero", correct: true },
          { id: uid("o"), text: "Falso", correct: false },
        ],
      });
      return;
    }
    if (type === "open") {
      patchQuestion(question.id, { type });
      return;
    }
    const current = question.options;
    patchQuestion(question.id, {
      type,
      options:
        current.length >= 2
          ? current
          : [
              { id: uid("o"), text: "", correct: true },
              { id: uid("o"), text: "", correct: false },
              { id: uid("o"), text: "", correct: false },
              { id: uid("o"), text: "", correct: false },
            ],
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col px-6 pb-4 pt-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-brand md:block">
            Pregunta {index + 1} de {quiz.questions.length}
          </p>

          {/* En móvil la lista lateral está oculta: damos navegación aquí. */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() =>
                index > 0 && selectQuestion(quiz.questions[index - 1].id)
              }
              disabled={index === 0}
              aria-label="Pregunta anterior"
              className="grid size-6 place-items-center rounded-md border border-line text-muted transition-colors hover:text-ink disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
              {index + 1} de {quiz.questions.length}
            </span>
            <button
              onClick={() =>
                index < quiz.questions.length - 1 &&
                selectQuestion(quiz.questions[index + 1].id)
              }
              disabled={index >= quiz.questions.length - 1}
              aria-label="Pregunta siguiente"
              className="grid size-6 place-items-center rounded-md border border-line text-muted transition-colors hover:text-ink disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          <h2 className="mt-1 text-[21px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
            Configura tu pregunta
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateQuestion(question.id)}
            className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-slate-200/60 hover:text-ink"
            aria-label="Duplicar pregunta"
          >
            <Copy className="size-4" />
          </button>
          <button
            onClick={() => removeQuestion(question.id)}
            disabled={quiz.questions.length <= 1}
            className="grid size-8 place-items-center rounded-lg text-danger transition-colors hover:bg-danger-soft disabled:opacity-40"
            aria-label="Eliminar pregunta"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex shrink-0 flex-col rounded-panel border border-line bg-surface p-5 shadow-card">
        {/* Enunciado */}
        <div className="shrink-0">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="statement"
              className="text-[12px] font-semibold text-ink"
            >
              Enunciado
            </label>
            <span className="text-[10px] text-muted">
              {question.statement.length}/160
            </span>
          </div>
          <textarea
            id="statement"
            name="statement"
            value={question.statement}
            maxLength={160}
            onChange={(event) =>
              patchQuestion(question.id, { statement: event.target.value })
            }
            placeholder="Escribe aquí la pregunta que verá tu clase…"
            rows={2}
            className="mt-1.5 min-h-[64px] w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] font-medium leading-snug text-ink outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-brand [field-sizing:content]"
          />
        </div>

        {/* Ajustes */}
        <div className="mt-3 grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-3">
          <div>
            <label
              htmlFor="question-type"
              className="mb-1 block text-[12px] font-semibold text-ink"
            >
              Tipo de respuesta
            </label>
            <Select
              id="question-type"
              name="question-type"
              value={question.type}
              onChange={(event) =>
                changeType(event.target.value as QuestionType)
              }
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label
              htmlFor="question-time"
              className="mb-1 block text-[12px] font-semibold text-ink"
            >
              Tiempo límite
            </label>
            <Select
              id="question-time"
              name="question-time"
              value={question.timeLimit}
              onChange={(event) =>
                patchQuestion(question.id, {
                  timeLimit: Number(event.target.value),
                })
              }
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time} segundos
                </option>
              ))}
            </Select>
          </div>
          <div className="hidden lg:block">
            <label
              htmlFor="question-points"
              className="mb-1 block text-[12px] font-semibold text-ink"
            >
              Puntaje
            </label>
            <Select
              id="question-points"
              name="question-points"
              value={question.points}
              onChange={(event) =>
                patchQuestion(question.id, {
                  points: Number(event.target.value),
                })
              }
            >
              {POINTS_OPTIONS.map((points) => (
                <option key={points} value={points}>
                  {points} pts
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="my-3 h-px shrink-0 bg-line" />

        {/* Opciones */}
        <div className="flex flex-col">
          <div className="flex items-baseline justify-between">
            <p className="text-[12px] font-semibold text-ink">
              Opciones de respuesta
            </p>
            <span className="text-[10px] text-muted">
              {isOpen
                ? "Se evalúan manualmente"
                : "Marca la respuesta correcta"}
            </span>
          </div>

          {isOpen ? (
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-line bg-app px-4 py-4">
              <Clock className="size-5 shrink-0 text-muted" />
              <p className="text-xs leading-relaxed text-muted">
                Las respuestas abiertas se recogen en el lobby y el profesor las
                revisa al finalizar la partida.
              </p>
            </div>
          ) : (
            <div className="mt-2 grid auto-rows-min grid-cols-1 content-start gap-2 sm:grid-cols-2">
              {question.options.map((option, optionIndex) => {
                const accent = OPTION_ACCENTS[optionIndex % OPTION_ACCENTS.length];
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "group flex h-11 items-center gap-2 rounded-xl border px-2.5 transition-colors duration-200",
                      option.correct
                        ? "border-brand bg-brand-soft"
                        : "border-line bg-surface hover:border-slate-300",
                    )}
                  >
                    <Shape
                      shape={accent.shape}
                      color={accent.color}
                      className="size-3.5 shrink-0"
                    />
                    <input
                      value={option.text}
                      maxLength={48}
                      name={`option-${option.id}`}
                      aria-label={`Texto de la opción ${optionIndex + 1}`}
                      onChange={(event) =>
                        patchOption(question.id, option.id, {
                          text: event.target.value,
                        })
                      }
                      placeholder={`Opción ${optionIndex + 1}`}
                      className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-slate-400"
                    />
                    {question.options.length > 2 && (
                      <button
                        onClick={() => removeOption(question.id, option.id)}
                        className="grid size-5 place-items-center rounded text-slate-300 opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                        aria-label="Quitar opción"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                    <button
                      onClick={() => markCorrect(question.id, option.id)}
                      aria-pressed={option.correct}
                      aria-label={`Marcar ${option.text || "opción"} como correcta`}
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors duration-200",
                        option.correct
                          ? "border-brand bg-brand text-white"
                          : "border-slate-300 hover:border-brand",
                      )}
                    >
                      {option.correct && <Check className="size-3" strokeWidth={3} />}
                    </button>
                  </div>
                );
              })}

              {question.options.length < 4 && (
                <button
                  onClick={() => addOption(question.id)}
                  className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-dashed border-line text-[12px] font-semibold text-muted transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <Plus className="size-3.5" />
                  Añadir opción
                </button>
              )}
            </div>
          )}

          {error && (
            <p className="mt-2 shrink-0 rounded-lg bg-danger-soft px-3 py-1.5 text-[11px] font-medium text-danger">
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
