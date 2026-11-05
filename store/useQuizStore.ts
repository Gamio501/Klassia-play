"use client";

import { create } from "zustand";
import type {
  AnswerOption,
  Question,
  Quiz,
  QuizValidation,
} from "@/types/klassia";
import { updateQuiz } from "@/lib/api/endpoints";
import { uid } from "@/lib/utils/format";

export const QUESTIONS_PER_PAGE = 3;

interface QuizState {
  quiz: Quiz | null;
  selectedId: string | null;
  page: number;
  saving: boolean;
  lastSavedAt: string | null;
  errors: QuizValidation["errors"];

  init: (quiz: Quiz) => void;
  setTitle: (title: string) => void;
  selectQuestion: (id: string) => void;
  setPage: (page: number) => void;

  addQuestion: () => void;
  duplicateQuestion: (id: string) => void;
  removeQuestion: (id: string) => void;

  patchQuestion: (id: string, patch: Partial<Question>) => void;
  addOption: (questionId: string) => void;
  patchOption: (
    questionId: string,
    optionId: string,
    patch: Partial<AnswerOption>,
  ) => void;
  removeOption: (questionId: string, optionId: string) => void;
  markCorrect: (questionId: string, optionId: string) => void;

  validate: () => boolean;
  save: () => Promise<boolean>;
}

export const blankQuestion = (): Question => ({
  id: uid("q"),
  statement: "",
  type: "multiple",
  timeLimit: 30,
  points: 1000,
  mediaUrl: null,
  options: [
    { id: uid("o"), text: "", correct: true },
    { id: uid("o"), text: "", correct: false },
    { id: uid("o"), text: "", correct: false },
    { id: uid("o"), text: "", correct: false },
  ],
});

function validateQuiz(quiz: Quiz): QuizValidation["errors"] {
  const errors: QuizValidation["errors"] = [];

  quiz.questions.forEach((question, index) => {
    if (!question.statement.trim()) {
      errors.push({
        questionId: question.id,
        message: `La pregunta ${index + 1} no tiene enunciado.`,
      });
      return;
    }

    if (question.type === "open") return;

    const filled = question.options.filter((option) => option.text.trim());
    if (filled.length < 2) {
      errors.push({
        questionId: question.id,
        message: `La pregunta ${index + 1} necesita al menos 2 opciones.`,
      });
      return;
    }
    if (!question.options.some((option) => option.correct)) {
      errors.push({
        questionId: question.id,
        message: `La pregunta ${index + 1} no tiene respuesta correcta marcada.`,
      });
    }
  });

  return errors;
}

/**
 * Si ya se mostraron errores, los recalculamos en cada edición para que el
 * aviso desaparezca en cuanto el profesor corrige la pregunta.
 */
function withRefreshedErrors(state: QuizState, quiz: Quiz): Partial<QuizState> {
  if (state.errors.length === 0) return { quiz };
  return { quiz, errors: validateQuiz(quiz) };
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  quiz: null,
  selectedId: null,
  page: 0,
  saving: false,
  lastSavedAt: null,
  errors: [],

  init: (quiz) =>
    set({
      quiz,
      selectedId: quiz.questions[0]?.id ?? null,
      page: 0,
      errors: [],
    }),

  setTitle: (title) =>
    set((state) =>
      state.quiz ? { quiz: { ...state.quiz, title } } : state,
    ),

  selectQuestion: (id) => set({ selectedId: id }),

  setPage: (page) => set({ page }),

  addQuestion: () =>
    set((state) => {
      if (!state.quiz) return state;
      const question = blankQuestion();
      const questions = [...state.quiz.questions, question];
      return {
        quiz: { ...state.quiz, questions },
        selectedId: question.id,
        page: Math.floor((questions.length - 1) / QUESTIONS_PER_PAGE),
      };
    }),

  duplicateQuestion: (id) =>
    set((state) => {
      if (!state.quiz) return state;
      const source = state.quiz.questions.find((item) => item.id === id);
      if (!source) return state;
      const copy: Question = {
        ...source,
        id: uid("q"),
        options: source.options.map((option) => ({
          ...option,
          id: uid("o"),
        })),
      };
      const questions = [...state.quiz.questions, copy];
      return {
        quiz: { ...state.quiz, questions },
        selectedId: copy.id,
        page: Math.floor((questions.length - 1) / QUESTIONS_PER_PAGE),
      };
    }),

  removeQuestion: (id) =>
    set((state) => {
      if (!state.quiz) return state;
      const questions = state.quiz.questions.filter((item) => item.id !== id);
      return {
        quiz: { ...state.quiz, questions },
        selectedId:
          state.selectedId === id
            ? (questions[0]?.id ?? null)
            : state.selectedId,
        page: Math.min(
          state.page,
          Math.max(0, Math.ceil(questions.length / QUESTIONS_PER_PAGE) - 1),
        ),
      };
    }),

  patchQuestion: (id, patch) =>
    set((state) => {
      if (!state.quiz) return state;
      const quiz: Quiz = {
        ...state.quiz,
        questions: state.quiz.questions.map((question) =>
          question.id === id ? { ...question, ...patch } : question,
        ),
      };
      return withRefreshedErrors(state, quiz);
    }),

  addOption: (questionId) =>
    set((state) => {
      if (!state.quiz) return state;
      return {
        quiz: {
          ...state.quiz,
          questions: state.quiz.questions.map((question) =>
            question.id === questionId &&
            question.options.length < 6
              ? {
                  ...question,
                  options: [
                    ...question.options,
                    { id: uid("o"), text: "", correct: false },
                  ],
                }
              : question,
          ),
        },
      };
    }),

  patchOption: (questionId, optionId, patch) =>
    set((state) => {
      if (!state.quiz) return state;
      const quiz: Quiz = {
        ...state.quiz,
        questions: state.quiz.questions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                options: question.options.map((option) =>
                  option.id === optionId ? { ...option, ...patch } : option,
                ),
              }
            : question,
        ),
      };
      return withRefreshedErrors(state, quiz);
    }),

  removeOption: (questionId, optionId) =>
    set((state) => {
      if (!state.quiz) return state;
      const quiz: Quiz = {
        ...state.quiz,
        questions: state.quiz.questions.map((question) => {
          if (question.id !== questionId || question.options.length <= 2) {
            return question;
          }
          return {
            ...question,
            options: question.options.filter(
              (option) => option.id !== optionId,
            ),
          };
        }),
      };
      return withRefreshedErrors(state, quiz);
    }),

  markCorrect: (questionId, optionId) =>
    set((state) => {
      if (!state.quiz) return state;
      const quiz: Quiz = {
        ...state.quiz,
        questions: state.quiz.questions.map((question) => {
          if (question.id !== questionId) return question;
          return {
            ...question,
            options: question.options.map((option) => ({
              ...option,
              correct: option.id === optionId,
            })),
          };
        }),
      };
      return withRefreshedErrors(state, quiz);
    }),

  validate: () => {
    const { quiz } = get();
    if (!quiz) return false;
    const errors = validateQuiz(quiz);
    set({ errors });
    return errors.length === 0;
  },

  save: async () => {
    const { quiz, validate } = get();
    if (!quiz) return false;
    if (!validate()) return false;
    set({ saving: true });
    try {
      const saved = await updateQuiz(quiz.id, {
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        grade: quiz.grade,
        status: quiz.status,
        questions: quiz.questions,
      });
      set({
        quiz: { ...quiz, ...saved },
        saving: false,
        lastSavedAt: new Date().toISOString(),
        errors: [],
      });
      return true;
    } catch {
      set({ saving: false });
      return false;
    }
  },
}));
